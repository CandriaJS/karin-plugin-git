import path from 'node:path'
import { full as emoji } from 'markdown-it-emoji'
import { tasklist } from '@mdit/plugin-tasklist'
import { segment, render, karinPathHtml } from 'node-karin'
import * as component from '@puniyu/component'
import { Version } from '@/root'
import MarkdownIt from 'markdown-it'
import {
  Platform,
  render as template_render,
  CommitInfo,
  github,
  gitee,
  cnbcool,
  gitcode,
} from '@candriajs/template'
import type { ReactNode } from 'react'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const Render = {
  async render(element: ReactNode, name: string) {
    const html = template_render(element)
    const htmlDir = path.join(karinPathHtml, Version.Plugin_Name)
    const hash = createHash('md5').update(html).digest('hex').substring(0, 16)
    const htmlPath = path.join(htmlDir, `${name}_${hash}.html`)
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true })
    }
    fs.writeFileSync(htmlPath, html)
    const img = await render.render({
      file: htmlPath,
      scale: 1,
      screensEval: '#app',
      pageGotoParams: {
        waitUntil: 'networkidle0',
        timeout: 60000,
      },
    })
    return segment.image(`base64://${img.toString()}`)
  },
  async commit(platform: Platform = Platform.GitHub, options: CommitInfo) {
    const name = 'commit'
    switch (platform) {
      case Platform.GitHub:
        return await Render.render(github.Commit({ ...options }), name)
      case Platform.Gitee:
        return await Render.render(gitee.Commit({ ...options }), name)
      case Platform.GitCode:
        return await Render.render(gitcode.Commit({ ...options }), name)
      case Platform.CnbCool:
        return await Render.render(cnbcool.Commit({ ...options }), name)
    }
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
  help: component.help,
}

export { Render }
