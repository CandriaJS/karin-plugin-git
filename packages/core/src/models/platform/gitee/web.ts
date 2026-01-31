import { Config } from '@/common'
import { EventType } from '@/types'
import { RepoInfo } from '@/types/web'
import { components } from 'node-karin'

export const web = (list: RepoInfo[]) => {
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
    components.accordionPro.create(
      'pushlist:gitee',
      list.map((repo) => {
        return {
          title: `${repo.owner}/${repo.repo}:${repo.branch}`,
          ...repo,
        }
      }),
      {
        label: 'Gitee 推送仓库列表',
        children: components.accordion.createItem('accordion-item-gitee', {
          subtitle: 'Gitee 仓库',
          children: [
            components.input.string('owner', {
              label: '仓库所有者',
              placeholder: '请输入 Gitee 仓库所有者',
            }),
            components.input.string('repo', {
              label: '仓库名称',
              placeholder: '请输入 Gitee 仓库名称',
            }),
            components.input.string('branch', {
              label: '仓库分支',
              placeholder: '请输入 Gitee 仓库分支',
              isRequired: true
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
