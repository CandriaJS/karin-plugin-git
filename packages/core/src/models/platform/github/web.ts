import { Config } from '@/common'
import { components } from 'node-karin'
import { RepoInfo } from '@/types/web'
import { EventType } from '@/types'

export const web = (list: RepoInfo[]) => {
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
    components.accordionPro.create(
      'pushlist:github',
      list.map((repo) => {
        return {
          title: `${repo.owner}/${repo.repo}:${repo.branch}`,
          subtitle: `${repo.botId}:${repo.groupId}`,
          ...repo,
        }
      }),
      {
        label: 'Github 推送仓库列表',
        children: components.accordion.createItem('accordion-item-github', {
          children: [
            components.input.string('owner', {
              label: '仓库所有者',
              placeholder: '请输入 Github 仓库所有者',
            }),
            components.input.string('repo', {
              label: '仓库名称',
              placeholder: '请输入 Github 仓库名称',
            }),
            components.input.string('branch', {
              label: '仓库分支',
              placeholder: '请输入 Github 仓库分支',
            }),
            components.input.string('botId', {
              label: '推送机器人',
              placeholder: '请输入 推送机器人账号',
            }),
            components.input.string('groupId', {
              label: '推送群组',
              placeholder: '请输入 推送群组ID',
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
