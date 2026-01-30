import { Config } from '@/common'
import { ComponentConfig, components } from 'node-karin'

export const web = (): ComponentConfig[] => {
  return [
    components.accordion.create('gitcode', {
      label: 'GitCode 相关',
      children: [
        components.accordion.createItem('config:gitcode', {
          title: 'GitCode 相关',
          subtitle: 'GitCode 相关配置',
          children: [
            components.input.string('cron', {
              label: '推送任务执行时间',
              description: '推送任务执行时间',
              placeholder: '请输入推送任务Cron 表达式',
              defaultValue: Config.gitcode.cron,
            }),
          ],
        }),
      ],
    }),
  ]
}
