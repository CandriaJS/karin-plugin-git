import path from 'node:path'
import { segment, render, karinPathHtml } from 'node-karin'
import * as component from '@puniyu/component'
import { Version } from '@/root'
import {
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
import { Platform } from '@/types'

const Render = {
  async render(element: ReactNode, name: string) {
    const html = template_render(element)
    const htmlDir = path.join(karinPathHtml, Version.Plugin_Name)
    const hash = createHash('md5').update(html).digest('hex').substring(0, 16)
    const htmlPath = path.join(htmlDir, `${name}_${hash}.html`)
    if (!fs.existsSync(htmlDir)) {
      await fs.promises.mkdir(htmlDir, { recursive: true })
    }
    await fs.promises.writeFile(htmlPath, html, 'utf-8')
    const img = await render.render({
      file: htmlPath,
      scale: 1,
      screensEval: '#root',
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
  help: component.help,
}

export { Render }
