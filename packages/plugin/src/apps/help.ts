import MarkdownIt from 'markdown-it'
import karin, { Message, requireFile } from 'node-karin'

import { Render } from '@/common'
import { Version } from '@/root'
import { Role } from '@/types/help'

export const help = karin.command(
  /^#?(?:(git))(?:命令|帮助|菜单|help|说明|功能|指令|使用说明)$/i,
  async (e: Message) => {
    const role: Role = e.isMaster ? 'master' : 'member'
    const img = await Render.help(role)
    await e.reply(img)
    return true
  },
  {
    name: 'karin-plugin-git:help',
    priority: 500,
    event: 'message',
    permission: 'all',
  },
)

export const version = karin.command(
  /^#?(?:(git))(?:版本|版本信息|version|versioninfo)$/i,
  async (e: Message) => {
    const md = new MarkdownIt({ html: true })
    const makdown = md.render(
      await requireFile(`${Version.Plugin_Path}/CHANGELOG.md`),
    )
    const img = await Render.render('help/version-info', {
      Markdown: makdown,
    })
    await e.reply(img)
    return true
  },
  {
    name: 'karin-plugin-git:version',
    priority: 500,
    event: 'message',
    permission: 'all',
  },
)
