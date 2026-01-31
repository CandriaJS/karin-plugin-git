import { Config } from '@/common'
import { EventType } from '@/types'
import { RepoInfo } from '@/types/web'
import { ComponentConfig, components } from 'node-karin'

export const web = (list: RepoInfo[]): ComponentConfig[] => {
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
    components.accordionPro.create(
      'pushlist:gitcode',
      list.map((repo) => {
        return {
          title: `${repo.owner}/${repo.repo}:${repo.branch}`,
          ...repo,
        }
      }),
      {
        label: 'GitCode 推送仓库列表',
        children: components.accordion.createItem('accordion-item-gitcode', {
          subtitle: 'GitCode 仓库',
          children: [
            components.input.string('owner', {
              label: '仓库所有者',
              placeholder: '请输入 GitCode 仓库所有者',
            }),
            components.input.string('repo', {
              label: '仓库名称',
              placeholder: '请输入 GitCode 仓库名称',
            }),
            components.input.string('branch', {
              label: '仓库分支',
              placeholder: '请输入 GitCode 仓库分支',
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
