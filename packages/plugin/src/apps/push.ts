import { render_markdown } from '@/common/render'
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

export const github = karin.task(
  'karin-plugin-git:github',
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

const handleRepoPush = async (client: ClientType, platform: Platform) => {
  const all = await db.push.GetAll()

  if (isEmpty(all)) return

  const repoInfos = all.filter((repo) => repo.platform === platform)

  for (const repo of repoInfos) {
    const pushRepoInfo = await db.repo.GetRepo(repo.repoId)
    if (!pushRepoInfo) continue

    const commitInfo = await client.getCommitInfo(
      pushRepoInfo.owner,
      pushRepoInfo.repo,
      repo.branch,
    )

    if (commitInfo.sha === repo.commitSha) continue

    const messageParts = commitInfo.commit.message.split('\n')
    const PushInfo: PushCommitInfo = {
      ...commitInfo,
      owner: pushRepoInfo.owner,
      repo: pushRepoInfo.repo,
      botId: pushRepoInfo.botId,
      groupId: pushRepoInfo.groupId,
      title: await render_markdown(messageParts[0]),
      body: await render_markdown(messageParts.slice(1).join('\n')),
      commitDate: formatDate(commitInfo.commit.committer.date),
    }

    let image: ImageElement[] = []
    const img = await Render.render('commit/index', {
      commit: PushInfo,
    })
    image.push(img)

    const bot = getBot(pushRepoInfo.botId)
    const contact = await contactGroup(pushRepoInfo.groupId)

    if (image.length > 1) {
      const res = await common.makeForward(
        image,
        pushRepoInfo.botId,
        bot?.account.name,
      )
      await bot?.sendForwardMsg(contact, res, {
        source: '仓库推送合集',
        summary: `查看${res.length}张仓库推送消息`,
        prompt: 'Gitub仓库推送结果',
        news: [{ text: '点击查看推送结果' }],
      })
    } else {
      await bot?.sendMsg(contact, image)
    }

    await db.push.UpdateCommitSha(
      platform,
      repo.repoId,
      repo.branch,
      commitInfo.sha,
    )
  }
}
