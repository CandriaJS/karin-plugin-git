import path from 'node:path'
import { segment, render, karinPathHtml } from 'node-karin'
import * as component from '@puniyu/component'
import { Version } from '@/root'
import {
  render as template_render,
  CommitInfo,
  ReleaseInfo,
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
    const htmlDir = path.join(karinPathHtml, Version.Plugin_Name)
    if (!fs.existsSync(htmlDir)) {
      await fs.promises.mkdir(htmlDir, { recursive: true })
    }

    const html = template_render(element)
    const hash = createHash('md5').update(html).digest('hex').substring(0, 16)
    const htmlPath = path.join(htmlDir, `${name}_${hash}.html`)

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
    return segment.image(img.startsWith('base64') ? img : `base64://${img}`)
  },
  async commit(platform: Platform = Platform.GitHub, options: CommitInfo) {
    switch (platform) {
      case Platform.GitHub: {
        const name = github.Commit.displayName.toLowerCase()
        return await Render.render(github.Commit({ ...options }), name)
      }
      case Platform.Gitee: {
        const name = gitee.Commit.displayName.toLowerCase()
        return await Render.render(gitee.Commit({ ...options }), name)
      }
      case Platform.GitCode: {
        const name = gitcode.Commit.displayName.toLowerCase()
        return await Render.render(gitcode.Commit({ ...options }), name)
      }
      case Platform.CnbCool: {
        const name = cnbcool.Commit.displayName.toLowerCase()
        return await Render.render(cnbcool.Commit({ ...options }), name)
      }
    }
  },
  async release(platform: Platform = Platform.GitHub, options: ReleaseInfo) {
    switch (platform) {
      case Platform.GitHub: {
        const name = github.Release.displayName.toLowerCase()
        return await Render.render(github.Release({ ...options }), name)
      }
      case Platform.Gitee: {
        const name = gitee.Release.displayName.toLowerCase()
        return await Render.render(gitee.Release({ ...options }), name)
      }
      case Platform.GitCode: {
        const name = gitcode.Release.displayName.toLowerCase()
        return await Render.render(gitcode.Release({ ...options }), name)
      }
      case Platform.CnbCool: {
        const name = cnbcool.Release.displayName.toLowerCase()
        return await Render.render(cnbcool.Release({ ...options }), name)
      }
    }
  },
  help: component.help,
}

export { Render }
