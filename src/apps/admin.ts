import { Client, Config, make_hash } from '@/common'
import { db } from '@/models'
import { ClientType, EventType, Platform } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import karin from 'node-karin'

export const AddRepo = karin.command(
  /^#?git(?:添加|add)([^\s]+)?订阅仓库([^/\s]+)\/([^:\s]+)(?::([^/\s]+))?(?:\s+([^/\s]+))?$/i,
  async (e) => {
    const [, platform, owner, repo, branch, event] = e.msg.match(AddRepo!.reg)!

    const eventType = event
      ? (event
          .toLocaleLowerCase()
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e) as Array<EventType>)
      : [EventType.Push]
    if (!eventType.length) {
      eventType.push(EventType.Push)
    }

    let botId = e.selfId
    let groupId = e.groupId
    let platformName = Platform.GitHub
    let client: ClientType

    if (platform?.toLowerCase() === 'gitcode') {
      platformName = Platform.GitCode
      client = Client.gitcode()
    } else if (platform?.toLowerCase() === 'gitee') {
      platformName = Platform.Gitee
      client = Client.gitee()
    } else if (platform?.toLowerCase() === 'cnb') {
      platformName = Platform.Cnb
      client = Client.cnb()
    } else {
      platformName = Platform.GitHub
      client = Client.github()
    }

    let repoInfo = await db.repo.GetRepo(botId, groupId, owner, repo)
    if (!repoInfo) {
      await db.repo.AddRepo(botId, groupId, owner, repo)
      repoInfo = await db.repo.GetRepo(botId, groupId, owner, repo)
    }
    if (!repoInfo) return await e.reply('添加订阅仓库失败，请重试')

    let eventInfo = await db.event.GetRepo(platformName, repoInfo.id, eventType)
    if (!eventInfo) {
      await db.event.AddRepo(platformName, repoInfo.id, eventType)
      eventInfo = await db.event.GetRepo(platformName, repoInfo.id, eventType)
    } else {
      await db.event.UpdateEventType(platformName, repoInfo.id, eventType)
    }
    if (!eventInfo) {
      return await e.reply('添加仓库订阅事件失败，请重试')
    }

    let msg = `添加订阅仓库成功, 平台: ${platformName}, 仓库: ${owner}/${repo}, 订阅类型: ${eventType.join(',')}`

    const PushEvent = eventType.includes(EventType.Push)
    if (PushEvent) {
      const repoClient = client.repo()
      const PushBranch =
        branch || (await repoClient.info({ owner, repo })).defaultBranch
      const pushRepo = await db.push.GetRepo(eventInfo.id, PushBranch)
      if (!pushRepo) {
        await db.push.AddRepo(eventInfo.id, PushBranch)
        msg += `, 分支: ${PushBranch}`
      } else {
        msg = `仓库 ${owner}/${repo} 的推送订阅已存在，平台: ${platformName}, 分支: ${PushBranch}`
      }
    }

    const IssueEvent = eventType.includes(EventType.Issue)
    if (IssueEvent) {
      const IssueRepo = await db.issue.GetRepo(eventInfo.id)
      if (!IssueRepo.length) {
        const issueClient = client.issue()
        const issueInfoList = await issueClient.list(
          { owner, repo },
          {
            perPage: 100,
          },
        )
        if (isEmpty(issueInfoList))
          return await e.reply('添加议题订阅失败，请重试')
        for (const issueInfo of issueInfoList) {
          await db.issue.AddRepo(
            eventInfo.id,
            issueInfo.number,
            make_hash(issueInfo.title),
            issueInfo.body ? make_hash(issueInfo.body) : null,
            issueInfo.state,
          )
        }
      } else {
        msg = `仓库 ${owner}/${repo} 的议题订阅已存在, 平台: ${platformName}`
      }
    }
    console.log(PushEvent, IssueEvent)

    await e.reply(msg)
  },
  {
    name: 'karin-plugin-git:admin:addRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
)

export const RemoveRepo = karin.command(
  /^#?git(?:移除|删除|remove)([^\s]+)?订阅仓库([^/\s]+)\/([^:\s]+)(?::([^/\s]+))?(?:\s+([^/\s]+))?$/i,
  async (e) => {
    const [, platform, owner, repo, branch, event] = e.msg.match(
      RemoveRepo!.reg,
    )!
    let botId = e.selfId
    let groupId = e.groupId
    let platformName = Platform.GitHub
    const eventType = event
      ? (event
          .toLocaleLowerCase()
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e) as Array<EventType>)
      : [EventType.Push]
    if (!eventType.length) {
      eventType.push(EventType.Push)
    }

    if (platform?.toLowerCase() === 'gitcode') {
      platformName = Platform.GitCode
    } else if (platform?.toLowerCase() === 'gitee') {
      platformName = Platform.Gitee
    } else if (platform?.toLowerCase() === 'cnb') {
      platformName = Platform.Cnb
    }

    const repoInfo = await db.repo.GetRepo(botId, groupId, owner, repo)
    if (!repoInfo) {
      return await e.reply('未找到该仓库, 删除失败,请重试')
    }
    let eventInfo = await db.event.GetRepo(platformName, repoInfo.id, eventType)
    if (!eventInfo) {
      return await e.reply('未找到该订阅事件, 删除失败,请重试')
    }

    const PushEvent = eventType.includes(EventType.Push)
    if (PushEvent) {
      const event = eventInfo.eventType.filter((e) => e !== EventType.Push)
      await db.event.UpdateEventType(platformName, repoInfo.id, event)
      const pushRepo = await db.push.GetRepo(eventInfo.id, branch)
      if (!pushRepo) {
        return await e.reply('推送订阅不存在，删除失败')
      }
      await db.push.RemoveRepo(eventInfo.id, branch)
    }
    const IssueEvent = eventType.includes(EventType.Issue)
    if (IssueEvent) {
      const event = eventInfo.eventType.filter((e) => e !== EventType.Issue)
      await db.event.UpdateEventType(platformName, repoInfo.id, event)
      const issueRepo = await db.issue.GetRepo(eventInfo.id)
      if (!issueRepo) {
        return await e.reply('议题订阅不存在，删除失败')
      }
      await db.issue.RemoveRepo(eventInfo.id)
    }

    await e.reply(
      `删除订阅仓库成功, 平台: ${platformName}, 仓库: ${owner}/${repo}, 订阅类型: ${eventType.join(',')}`,
    )
  },
  {
    name: 'karin-plugin-git:admin:removeRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
)

export const SetToken = karin.command(
  /^#?git(?:设置|set)([^\s]+)?(?:token|访问令牌)([\s\S]+)$/i,
  async (e) => {
    const [, platform, Token] = e.msg.match(SetToken!.reg)!
    let platformName = Platform.GitHub
    if (platform?.toLowerCase() === 'gitcode') {
      platformName = Platform.GitCode
    } else if (platform?.toLowerCase() === 'gitee') {
      platformName = Platform.Gitee
    } else if (platform?.toLowerCase() === 'cnb') {
      platformName = Platform.Cnb
    }
    Config.Modify(platformName, 'token', Token)
    await e.reply(`设置${platformName}访问令牌成功`)
  },
  {
    name: 'karin-plugin-git:admin:SetToken',
    priority: 500,
    event: 'message.friend',
    permission: 'master',
  },
)
