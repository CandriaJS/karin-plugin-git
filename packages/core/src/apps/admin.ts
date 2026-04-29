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
        return await e.reply('未支持的平台，目前支持: github、gitee、gitcode、cnbcool')
    }

    let [repoInfo, sessionInfo] = await Promise.all([
      db.repo.GetRepo(platformName, owner, repo),
      db.session.GetSession(botId, groupId),
    ])
    if (!repoInfo) {
      await db.repo.AddRepo(platformName, owner, repo)
      repoInfo = await db.repo.GetRepo(platformName, owner, repo)
    }
    if (!sessionInfo) {
      await db.session.AddSession(botId, groupId)
      sessionInfo = await db.session.GetSession(botId, groupId)
    }
    if (!repoInfo || !sessionInfo)
      return await e.reply('添加订阅仓库失败，请稍后重试')

    const eventLabels: string[] = []
    const pushRepo = await db.push.GetPush(repoInfo.id, sessionInfo.id, 'main')
    if (eventType.includes(EventType.Push)) {
      if (!pushRepo) {
        const repoClient = client.repo()
        let defaultBranch: string
        try {
          const repo_info = await repoClient.info({ owner, repo })
          defaultBranch = repo_info.defaultBranch
        } catch {
          defaultBranch = 'main'
        }
        await db.push.AddPush(repoInfo.id, sessionInfo.id, defaultBranch)
        eventLabels.push(`推送订阅 (分支: ${defaultBranch})`)
      } else {
        eventLabels.push('推送订阅')
      }
    }

    const releaseRepo = await db.release.GetRelease(repoInfo.id, sessionInfo.id)
    if (eventType.includes(EventType.Release)) {
      if (!releaseRepo) {
        await db.release.AddRelease(repoInfo.id, sessionInfo.id, 'latest')
        eventLabels.push('Release 订阅')
      } else {
        eventLabels.push('Release 订阅')
      }
    }

    if (eventLabels.length === 0) {
      return await e.reply('未指定订阅类型，请指定 push 或 release')
    }

    await e.reply(`订阅成功！仓库: ${owner}/${repo}，订阅类型: ${eventLabels.join('、')}`)
  },
  {
    name: 'admin:addRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
)

export const BindRepo = karin.command(
  /^#?git(?:绑定|bind)(?:仓库|repo)(?:([a-zA-Z]+):([^/\s]+)\/([^:\s]+))$/i,
  async (e) => {
    const [, platform, owner, repo] = e.msg.match(BindRepo!.reg)!
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
        return await e.reply('未支持的平台，目前支持: github、gitee、gitcode、cnbcool')
    }

    let repoInfo = await db.repo.GetRepo(platformName, owner, repo)
    if (!repoInfo) {
      await db.repo.AddRepo(platformName, owner, repo)
      repoInfo = await db.repo.GetRepo(platformName, owner, repo)
    }
    if (!repoInfo) {
      return await e.reply('绑定仓库失败，请稍后重试')
    }
    const BindInfo = await db.bind.GetBind(e.groupId)
    if (BindInfo) {
      return await e.reply('该群已绑定仓库，请勿重复绑定')
    }
    await db.bind.AddBind(e.groupId, repoInfo.id)
    await e.reply(`绑定仓库成功，仓库: ${owner}/${repo}`)
  },
  {
    name: 'admin:bindRepo',
    event: 'message.group',
  },
)

export const RemoveRepo = karin.command(
  /^#?git(?:移除|删除|remove)(?:订阅仓库|repo)(?:([a-zA-Z]+):([^/\s]+)\/([^:\s]+))(?:\s+([^/\s]+))?$/i,
  async (e) => {
    const [, platform, owner, repo, event] = e.msg.match(RemoveRepo!.reg)!
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
        return await e.reply('未支持的平台，目前支持: github、gitee、gitcode、cnbcool')
    }

    const [repoInfo, sessionInfo] = await Promise.all([
      db.repo.GetRepo(platformName, owner, repo),
      db.session.GetSession(botId, groupId),
    ])
    if (!repoInfo || !sessionInfo) {
      return await e.reply('未找到该订阅仓库，删除失败')
    }

    const removeLabels: string[] = []
    if (!event || event.toLowerCase().includes('push')) {
      await db.push.RemovePush(repoInfo.id, sessionInfo.id)
      removeLabels.push('推送订阅')
    }
    if (!event || event.toLowerCase().includes('release')) {
      await db.release.RemoveRelease(repoInfo.id, sessionInfo.id)
      removeLabels.push('Release 订阅')
    }

    if (removeLabels.length === 0) {
      return await e.reply('未指定订阅类型，请指定 push 或 release')
    }

    await e.reply(`删除订阅成功，已取消: ${removeLabels.join('、')}`)
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
        return await e.reply('未支持的平台，目前支持: github、gitee、gitcode、cnbcool')
    }
    Config.Modify(configKey, 'token', Token)
    await e.reply(`${platform.toLowerCase()} 访问令牌设置成功`)
  },
  {
    name: 'admin:SetToken',
    priority: 500,
    event: 'message.friend',
    permission: 'master',
  },
)
