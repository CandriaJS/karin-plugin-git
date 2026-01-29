import { Config } from '@/common'
import { db, client as Client } from '@/models'
import { ClientType, ConfigType, EventType, Platform } from '@/types'
import karin from 'node-karin'

export const AddRepo = karin.command(
  /^#?git(?:添加|add)(?:订阅仓库|repo)(?:([a-zA-Z]+):([^/\s]+)\/([^:\s]+))(?:\s+([^/\s]+))?$/i,
  async (e) => {
    const [, platform, owner, repo, event] = e.msg.match(AddRepo!.reg)!

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
    let client: ClientType = Client.github()
    switch (platform.toLowerCase()) {
      case 'github':
        client = Client.github()
        platformName = Platform.GitHub
        break
      case 'gitcode':
        client = Client.gitcode()
        platformName = Platform.GitCode
        break
      case 'gitee':
        client = Client.gitee()
        platformName = Platform.Gitee
        break
      case 'cnb':
      case 'cnbcool':
        client = Client.cnbcool()
        platformName = Platform.CnbCool
        break
      default:
        return await e.reply('未找到该平台, 请重试')
    }

    let repoInfo = await db.repo.GetRepo(
      platformName,
      owner,
      repo,
      botId,
      groupId,
    )
    if (!repoInfo) {
      await db.repo.AddRepo(platformName, owner, repo, botId, groupId)
      repoInfo = await db.repo.GetRepo(
        platformName,
        owner,
        repo,
        botId,
        groupId,
      )
    }
    if (!repoInfo) return await e.reply('添加订阅仓库失败，请重试')

    let msg = `添加订阅仓库成功, 平台: ${platformName}, 仓库: ${owner}/${repo}, 订阅类型: ${eventType.join(',')}`

    const PushEvent = eventType.includes(EventType.Push)
    if (PushEvent) {
      const repoClient = client.repo()
      const PushBranch = (await repoClient.info({ owner, repo })).defaultBranch
      const pushRepo = await db.push.GetPush(repoInfo.id, PushBranch)
      if (!pushRepo) {
        await db.push.AddPush(repoInfo.id, PushBranch)
        msg += `, 分支: ${PushBranch}`
      } else {
        msg = `仓库 ${owner}/${repo} 的推送订阅已存在，平台: ${platformName}, 分支: ${PushBranch}`
      }
    }

    /// TODO: 添加Release订阅

    await e.reply(msg)
  },
  {
    name: 'admin:addRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
)

export const RemoveRepo = karin.command(
  /^#?git(?:移除|删除|remove)(?:订阅仓库|repo)(?:([a-zA-Z]+):([^/\s]+)\/([^:\s]+))$/i,
  async (e) => {
    const [, platform, owner, repo] = e.msg.match(RemoveRepo!.reg)!
    let botId = e.selfId
    let groupId = e.groupId
    let platformName = Platform.GitHub

    switch (platform.toLowerCase()) {
      case 'github':
        platformName = Platform.GitHub
        break
      case 'gitcode':
        platformName = Platform.GitCode
        break
      case 'gitee':
        platformName = Platform.Gitee
        break
      case 'cnb':
      case 'cnbcool':
        platformName = Platform.CnbCool
        break
      default:
        return await e.reply('未找到该平台, 请重试')
    }

    const repoInfo = await db.repo.GetRepo(
      platformName,
      botId,
      groupId,
      owner,
      repo,
    )
    if (!repoInfo) {
      return await e.reply('未找到该订阅仓库, 删除失败,请重试')
    }
    await db.push.RemovePush(repoInfo.id)

    await e.reply(`删除订阅仓库成功`)
  },
  {
    name: 'admin:removeRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
)

export const SetToken = karin.command(
  /^#?git(?:设置|set)([^\s]+)?(?:token|访问令牌)([\s\S]+)$/i,
  async (e) => {
    const [, platform, Token] = e.msg.match(SetToken!.reg)!
    let configKey: keyof ConfigType
    switch (platform.toLowerCase()) {
      case 'github':
        configKey = 'github'
        break
      case 'gitcode':
        configKey = 'gitcode'
        break
      case 'gitee':
        configKey = 'gitee'
        break
      case 'cnb':
      case 'cnbcool':
        configKey = 'cnbcool'
        break
      default:
        return await e.reply('未找到该平台, 请重试')
    }
    Config.Modify(configKey, 'token', Token)
    await e.reply(`设置${platform.toLowerCase()}访问令牌成功`)
  },
  {
    name: 'admin:SetToken',
    priority: 500,
    event: 'message.friend',
    permission: 'master',
  },
)
