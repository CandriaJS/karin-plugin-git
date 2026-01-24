import MarkdownIt from 'markdown-it'
import karin, { Message, requireFile, segment } from 'node-karin'

import { Render } from '@/common'
import { Version } from '@/root'
import { HelpGroup } from '@puniyu/component'
import fs from 'node:fs'

export const help = karin.command(
  /^#?(?:(git))(?:命令|帮助|菜单|help|说明|功能|指令|使用说明)$/i,
  async (e: Message) => {
    const subscribeIcon = await fs.promises.readFile(
      `${Version.Plugin_Path}/resources/icons/repo.svg`,
    )

    const List: HelpGroup = {
      name: '常用操作',
      list: [
        { 
          name: '订阅git仓库', 
          desc: '订阅git仓库并推送, 支持github,gitee,gitcode,cnbcool', 
          icon: subscribeIcon 
        },
      ],
    }

    const helpList: HelpGroup[] = [List]

    if (e.isMaster) {
      const subscriptionIcon = await fs.promises.readFile(
        `${Version.Plugin_Path}/resources/icons/subscription.svg`,
      )
      const tokenIcon = await fs.promises.readFile(
        `${Version.Plugin_Path}/resources/icons/token.svg`,
      )
      
      helpList.push({
        name: '管理命令',
        list: [
          { 
            name: '#git添加[platform]订阅仓库owner/repo[:branch] [event]', 
            desc: '添加一个订阅仓库, event可选:push,issue', 
            icon: subscriptionIcon 
          },
          { 
            name: '#git删除[platform]订阅仓库owner/repo[:branch] [event]', 
            desc: '删除一个订阅仓库', 
            icon: subscriptionIcon 
          },
          { 
            name: '#git设置[platform]token + token', 
            desc: '设置一个平台的访问令牌', 
            icon: tokenIcon 
          },
        ],
      })
    }
    const bg = await fs.promises.readFile(
      `${Version.Plugin_Path}/resources/background.webp`,
    )

    const img = await Render.help({
      title: 'Git 帮助',
      theme: {
        backgroundImage: bg
      },
      list: helpList,
    })

     await e.reply(segment.image(`base64://${img.toString('base64')}`))
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
