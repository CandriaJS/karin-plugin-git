import { db } from '@/models'
import karin, {
  getBot,
  logger,
  contactGroup,
  ImageElement,
  common,
} from 'node-karin'
import { Config, Render, Client } from '@/common'
import { isEmpty } from 'es-toolkit/compat'
import { formatDate } from '@/common/date'
import { PushCommitInfo } from '@/types/push'
import { Platform } from '@/types'
import { ClientType } from '@/types/common/client'
import { CommitInfo } from 'nipaw'
import { PushRepo, RepoInfo } from '@/types/db'

export const github = karin.task(
  'karin-plugin-git:push:github',
  Config.github.cron || '0 */5 * * * *',
  async () => {
    const token = Config.github.token
    if (isEmpty(token)) return logger.warn('未配置GitHub Token, 跳过任务')
    try {
      const client = Client.github()
      await handleRepoPush(client, Platform.GitHub)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const gitee = karin.task(
  'karin-plugin-git:push:gitee',
  Config.gitee.cron || '0 */5 * * * *',
  async () => {
    const token = Config.gitee.token
    if (isEmpty(token)) return logger.warn('Gitee Token, 跳过任务')
    try {
      const client = Client.gitee()
      await handleRepoPush(client, Platform.Gitee)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const gitcode = karin.task(
  'karin-plugin-git:push:gitee',
  Config.gitcode.cron || '0 */5 * * * *',
  async () => {
    const token = Config.gitcode.token
    if (isEmpty(token)) return logger.warn('GitCode Token, 跳过任务')
    try {
      const client = Client.gitcode()
      await handleRepoPush(client, Platform.GitCode)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const cnb = karin.task(
  'karin-plugin-git:push:cnb',
  Config.cnb.cron || '0 */5 * * * *',
  async () => {
    const token = Config.cnb.token
    if (isEmpty(token)) return logger.warn('未配置CNB Token, 跳过任务')
    try {
      const client = Client.cnb()
      await handleRepoPush(client, Platform.Cnb)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const push = karin.command(
  /^#?git(?:推送|push)订阅仓库$/i,
  async (e) => {
    try {
      const botId = e.selfId
      const groupId = e.groupId
      const PushInfos = await db.push.GetAll()

      if (isEmpty(Config.cnb.token))
        return await e.reply('未配置CNB Token, 请先配置CNB Token')
      let client: ClientType 
      let image: ImageElement[] = []
      for (const pushInfo of PushInfos) {
        const RepoInfo = await db.repo.GetRepo(pushInfo.repoId)
        if (!RepoInfo || RepoInfo.botId != botId || RepoInfo.groupId != groupId)
          continue
        if (pushInfo.platform == Platform.Gitee) {
          if (isEmpty(Config.gitee.token))
            return await e.reply('未配置Gitee Token, 请先配置Gitee Token')
          client = Client.gitee()
        } else if (pushInfo.platform == Platform.GitCode) {
          if (isEmpty(Config.gitcode.token))
            return await e.reply('未配置GitCode Token, 请先配置GitCode Token')
          client = Client.gitcode()
        } else if (pushInfo.platform == Platform.Cnb) {
          if (isEmpty(Config.cnb.token))
            return await e.reply('Cnb Token, 请先配置Cnb Token')
          client = Client.cnb()
        } else {
          if (isEmpty(Config.github.token))
            return await e.reply('未配置GitHub Token, 请先配置GitHub Token')
          client = Client.github()
        }

        let commitInfo: CommitInfo
        try {
          commitInfo = await client.getCommitInfo(
            RepoInfo.owner,
            RepoInfo.repo,
            pushInfo.branch,
          )
        } catch (error) {
          logger.warn(
            `获取仓库 ${RepoInfo.owner}/${RepoInfo.repo} 分支 ${pushInfo.branch} 提交信息失败:`,
            error,
          )
          continue
        }

        const messageParts = commitInfo.commit.message.split('\n')
        const pushCommitInfo: PushCommitInfo = {
          ...commitInfo,
          owner: RepoInfo.owner,
          repo: RepoInfo.repo,
          branch: pushInfo.branch,
          botId: botId,
          groupId: groupId,
          title: await Render.markdown(messageParts[0]),
          body: await Render.markdown(messageParts.slice(1).join('\n')),
          commitDate: formatDate(commitInfo.commit.committer.date),
        }

        const img = await Render.render('commit/index', {
          commit: pushCommitInfo,
        })
        image.push(img)
      }

      if (image.length > 0) {
        await sendImage(botId, groupId, image)
      }
    } catch (e) {
      logger.error(e)
    }
  },
  {
    name: 'karin-plugin-git:pushRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
)

const handleRepoPush = async (client: ClientType, platform: Platform) => {
  const all = await db.push.GetAll()

  if (isEmpty(all)) return

  const repoInfos = all.filter((repo) => repo.platform === platform)

  const groupMap = new Map<
    string,
    Array<{
      pushRepo: PushRepo
      pushRepoInfo: RepoInfo
      commitInfo: CommitInfo
    }>
  >()

  for (const repo of repoInfos) {
    const pushRepoInfo = await db.repo.GetRepo(repo.repoId)
    if (!pushRepoInfo) continue

    const commitInfo = await client.getCommitInfo(
      pushRepoInfo.owner,
      pushRepoInfo.repo,
      repo.branch,
    )

    if (commitInfo.sha === repo.commitSha) continue

    const groupKey = `${pushRepoInfo.botId}-${pushRepoInfo.groupId}`
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, [])
    }

    groupMap.get(groupKey)!.push({
      pushRepo: repo,
      pushRepoInfo,
      commitInfo,
    })
  }

  for (const [groupKey, items] of groupMap.entries()) {
    const [botId, groupId] = groupKey.split('-')
    let image: ImageElement[] = []

    for (const item of items) {
      const messageParts = item.commitInfo.commit.message.split('\n')
      const pushInfo: PushCommitInfo = {
        ...item.commitInfo,
        owner: item.pushRepoInfo.owner,
        repo: item.pushRepoInfo.repo,
        branch: item.pushRepo.branch,
        botId: item.pushRepoInfo.botId,
        groupId: item.pushRepoInfo.groupId,
        title: await Render.markdown(messageParts[0]),
        body: await Render.markdown(messageParts.slice(1).join('\n')),
        commitDate: formatDate(item.commitInfo.commit.committer.date),
      }

      const img = await Render.render('commit/index', {
        commit: pushInfo,
      })
      image.push(img)

      await db.push.UpdateCommitSha(
        platform,
        item.pushRepo.repoId,
        item.pushRepo.branch,
        item.commitInfo.sha,
      )
    }

    if (image.length > 0) {
      await sendImage(botId, groupId, image)
    }
  }
}

const sendImage = async (
  botId: string,
  groupId: string,
  image: ImageElement[],
) => {
  const bot = getBot(botId)
  const contact = await contactGroup(groupId)

  if (image.length > 1) {
    const res = await common.makeForward(image, botId, bot?.account.name)
    await bot?.sendForwardMsg(contact, res, {
      source: '仓库推送合集',
      summary: `查看${res.length}张仓库推送消息`,
      prompt: 'Gitub仓库推送结果',
      news: [{ text: '点击查看推送结果' }],
    })
  } else {
    await bot?.sendMsg(contact, image)
  }
}
