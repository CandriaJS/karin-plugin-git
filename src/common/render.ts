import path from 'node:path'
import { full as emoji } from 'markdown-it-emoji'
import { tasklist } from '@mdit/plugin-tasklist'
import karin, { segment } from 'node-karin'
import * as component from '@puniyu/component'
import { Version } from '@/root'
import MarkdownIt from 'markdown-it'

/**
 * 渲染精度
 * @param {string} pct 缩放百分比
 */
function scale(pct = 1) {
  const renderScale = 150
  const scale = Math.min(2, Math.max(0.5, renderScale / 100))
  pct = pct * scale
  return `style=transform:scale(${pct})`
}

/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
const Render = {
  async render(name: string, params: Record<string, any> = {}) {
    name = name.replace(/.html$/, '')
    const root = `${Version.Plugin_Path}/resources`
    const img = await karin.render({
      type: 'jpeg',
      encoding: 'base64',
      name: path.basename(name),
      file: `${root}/${name}.html`,
      data: {
        _res_path: `${Version.Plugin_Path}/resources`.replace(/\\/g, '/'),
        defaultLayout:
          `${Version.Plugin_Path}/resources/common/layout/default.html`.replace(
            /\\/g,
            '/',
          ),
        sys: {
          scale: scale(params.scale ?? 1),
        },
        copyright: `${Version.Bot_Name}<span class="version"> ${Version.Bot_Version}</span> & ${Version.Plugin_Name}<span class="version"> ${Version.Plugin_Version}`,
        ...params,
      },
      screensEval: '#containter',
      multiPage: 12000,
      pageGotoParams: {
        waitUntil: 'networkidle0',
        timeout: 60000,
      },
    })

    return segment.image(
      `${img.includes('base64://') ? img : `base64://${img}`}`,
    )
  },

  async markdown(markdown: string): Promise<string> {
    const md = new MarkdownIt({
      html: true,
      breaks: true,
    })
    md.use(emoji)
    md.use(tasklist)
    md.renderer.rules.bullet_list_open = () => '<ul style="list-style: none;">'
    return Promise.resolve(md.render(markdown))
  },
  help: component.help
}

export { Render }
