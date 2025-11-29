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
import { formatDate } from '@/common'
import { PushCommitInfo } from '@/types/push'
import { EventType, Platform } from '@/types'
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
    if (isEmpty(token)) return logger.warn('未配置CnbCool Token, 跳过任务')
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
      const all = await db.event.GetAll()

      let client: ClientType
      let image: ImageElement[] = []
      for (const event of all) {
        const RepoInfo = await db.repo.GetRepo(event.repoId)
        if (!RepoInfo) continue

        if (event.platform == Platform.Gitee) {
          if (isEmpty(Config.gitee.token))
            return await e.reply('未配置Gitee Token, 请先配置Gitee Token')
          client = Client.gitee()
        } else if (event.platform == Platform.GitCode) {
          if (isEmpty(Config.gitcode.token))
            return await e.reply('未配置GitCode Token, 请先配置GitCode Token')
          client = Client.gitcode()
        } else if (event.platform == Platform.Cnb) {
          if (isEmpty(Config.cnb.token))
            return await e.reply('Cnb Token, 请先配置Cnb Token')
          client = Client.cnb()
        } else {
          if (isEmpty(Config.github.token))
            return await e.reply('未配置GitHub Token, 请先配置GitHub Token')
          client = Client.github()
        }

        const pushRepoList = await db.push.GetRepo(event.id)
        const pushImagePromises = pushRepoList.map(async (pushInfo) => {
          try {
            const commitInfo = await client.getCommitInfo(
              RepoInfo.owner,
              RepoInfo.repo,
              pushInfo.branch,
            )

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

            return await Render.render('commit/index', {
              commit: pushCommitInfo,
            })
          } catch (error) {
            logger.warn(
              `获取仓库 ${RepoInfo.owner}/${RepoInfo.repo} 分支 ${pushInfo.branch} 提交信息失败:`,
              error,
            )
            return null
          }
        })
        const pushImages = (await Promise.allSettled(pushImagePromises))
          .filter(
            (result): result is PromiseFulfilledResult<ImageElement | null> =>
              result.status === 'fulfilled',
          )
          .map((result) => result.value)
          .filter((img): img is ImageElement => img !== null)
        image.push(...pushImages)
        const issueRepoList = await db.issue.GetRepo(event.id)

        const issueImagePromises = issueRepoList.map(async (issue) => {
          if (isEmpty(issue)) return null

          const issueInfo = await client.getIssueInfo(
            RepoInfo.owner,
            RepoInfo.repo,
            issue.issueId,
          )
          const pushIssueInfo = {
            owner: RepoInfo.owner,
            repo: RepoInfo.repo,
            title: await Render.markdown(issueInfo.title),
            body: issueInfo.body ? await Render.markdown(issueInfo.body) : null,
            user: issueInfo.user,
            state: issueInfo.state,
            issueDate: formatDate(issueInfo.createdAt),
          }

          return await Render.render('issue/index', {
            issue: pushIssueInfo,
          })
        })

        const issueImages = (await Promise.allSettled(issueImagePromises))
          .filter(
            (result): result is PromiseFulfilledResult<ImageElement | null> =>
              result.status === 'fulfilled',
          )
          .map((result) => result.value)
          .filter((img): img is ImageElement => img !== null)
        image.push(...issueImages)
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
  const all = await db.event.GetAll(platform, EventType.Push)

  if (isEmpty(all)) return

  const groupMap = new Map<
    string,
    Array<{
      pushRepo: PushRepo
      pushRepoInfo: RepoInfo
      commitInfo: CommitInfo
    }>
  >()

  for (const event of all) {
    const eventRepoInfo = await db.repo.GetRepo(event.repoId)
    if (!eventRepoInfo) continue
    const groupKey = `${eventRepoInfo.groupId}-${eventRepoInfo.botId}`
    let pushRepoList = await db.push.GetRepo(event.id)
    if (isEmpty(pushRepoList)) {
      const { defaultBranch } = await client.getRepoInfo(
        eventRepoInfo.owner,
        eventRepoInfo.repo,
      )
      await db.push.AddRepo(event.id, defaultBranch)
      pushRepoList = await db.push.GetRepo(event.repoId)
    }
    for (const pushRepo of pushRepoList) {
      const commitInfo = await client.getCommitInfo(
        eventRepoInfo.owner,
        eventRepoInfo.repo,
        pushRepo.branch,
      )
      if (!commitInfo || commitInfo.sha === pushRepo.commitSha) {
        logger.debug(
          `[karin-plugin-git] 平台: ${event.platform} 仓库:${eventRepoInfo.owner}/${eventRepoInfo.repo} 分支: ${pushRepo.branch} 提交信息无变更`,
        )
        continue
      }
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, [])
      }
      groupMap.get(groupKey)!.push({
        pushRepo,
        pushRepoInfo: eventRepoInfo,
        commitInfo,
      })
      logger.debug(
        `[karin-plugin-git] 平台: ${event.platform} 仓库:${eventRepoInfo.owner}/${eventRepoInfo.repo} 分支: ${pushRepo.branch} 提交信息变更`,
      )
      await db.push.UpdateCommitSha(
        pushRepo.eventId,
        pushRepo.branch,
        commitInfo.sha,
      )
    }
  }
  for (const [groupKey, items] of groupMap.entries()) {
    const [groupId, botId] = groupKey.split('-')

    const imagePromises = items.map(async (item) => {
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

      return await Render.render('commit/index', {
        commit: pushInfo,
      })
    })

    const image = (await Promise.allSettled(imagePromises))
      .filter((result): result is PromiseFulfilledResult<ImageElement> => {
        return result.status === 'fulfilled' && result.value !== null
      })
      .map((result) => result.value)

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

  if (image.length > 3) {
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
