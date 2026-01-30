import { Config } from '@/common'
import { components } from 'node-karin'

export const web = () => {
  return [
    components.accordion.create('github', {
      label: 'Github 相关',
      children: [
        components.accordion.createItem('config:github', {
          title: 'Github 相关',
          subtitle: 'Github 相关配置',
          children: [
            components.input.string('cron', {
              label: '推送任务执行时间',
              description: '推送任务执行时间',
              placeholder: '请输入推送任务Cron 表达式',
              defaultValue: Config.github.cron,
            }),
          ],
        }),
      ],
    }),
  ]
}
