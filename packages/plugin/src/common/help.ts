import { Version } from '@/root'
import { HelpListType } from '@/types/help'

export const helpList: HelpListType = [
  {
    group: '常用操作',
    list: [],
  },
  {
    group: '管理命令，仅主人可用',
    auth: 'master',
    list: [
      {
        icon: `${Version.Plugin_Path}/resources/icons/subscription.svg`,
        title: '#git添加订阅仓库owner/repo[:branch]',
        desc: '添加一个订阅仓库',
      },
    ],
  },
]
