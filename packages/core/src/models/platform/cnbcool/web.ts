import { Config } from '@/common'
import { EventType } from '@/types'
import { RepoInfo } from '@/types/web'
import { components } from 'node-karin'

export const web = (list: RepoInfo[]) => {
  return [
    components.accordion.create('cnbcool', {
      label: 'CnbCool 相关',
      children: [
        components.accordion.createItem('config:gitcode', {
          title: 'CnbCool 相关',
          subtitle: 'CnbCool 相关配置',
          children: [
            components.input.string('cron', {
              label: '推送任务执行时间',
              description: '推送任务执行时间',
              placeholder: '请输入推送任务Cron 表达式',
              defaultValue: Config.cnbcool.cron,
            }),
          ],
        }),
      ],
    }),
    components.accordionPro.create(
      'pushlist:cnbcool',
      list.map((repo) => {
        return {
          title: `${repo.owner}/${repo.repo}:${repo.branch}`,
          ...repo,
        }
      }),
      {
        label: 'CnbCool 推送仓库列表',
        children: components.accordion.createItem('accordion-item-cnbcoool', {
          subtitle: 'CnbCool 仓库',
          children: [
            components.input.string('owner', {
              label: '仓库所有者',
              placeholder: '请输入 CnbCool 仓库所有者',
            }),
            components.input.string('repo', {
              label: '仓库名称',
              placeholder: '请输入 CnbCool 仓库名称',
            }),
            components.input.string('branch', {
              label: '仓库分支',
              placeholder: '请输入 CnbCool 仓库分支',
            }),
            components.checkbox.group('event', {
              label: '推送事件',
              checkbox: [
                components.checkbox.create('event:push', {
                  label: 'push',
                  value: EventType.Push,
                }),
                components.checkbox.create('event:release', {
                  label: 'release',
                  value: EventType.Release,
                  isDisabled: true,
                }),
              ],
            }),
          ],
        }),
      },
    ),
  ]
}
