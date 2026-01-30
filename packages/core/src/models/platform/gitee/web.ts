import { Config } from '@/common'
import { components } from 'node-karin'

export const web = () => {
  return [
    components.accordion.create('gitee', {
      label: 'Gitee 相关',
      children: [
        components.accordion.createItem('config:gitee', {
          title: 'Gitee 相关',
          subtitle: 'Gitee 相关配置',
          children: [
            components.input.string('cron', {
              label: '推送任务执行时间',
              description: '推送任务执行时间',
              placeholder: '请输入推送任务Cron 表达式',
              defaultValue: Config.gitee.cron,
            }),
          ],
        }),
      ],
    }),
  ]
}
