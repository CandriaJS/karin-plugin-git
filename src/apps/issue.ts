import { Config, Client, make_hash, Render, formatDate } from '@/common'
import { db } from '@/models'
import { ClientType, EventType, Platform } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { IssueUserInfo, StateType } from 'nipaw'
import karin, {
  common,
  contactGroup,
  getBot,
  ImageElement,
  logger,
} from 'node-karin'

export const github = karin.task(
  'karin-plugin-git:issue:github',
  Config.github.cron || '0 */5 * * * *',
  async () => {
    const {token} = Config.github
    if (isEmpty(token)) return logger.warn('未配置GitHub Token, 跳过任务')
    try {
      const client = Client.github()
      handleRepoIssue(client, Platform.GitHub)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const gitee = karin.task(
  'karin-plugin-git:issue:gitee',
  Config.gitee.cron || '0 */5 * * * *',
  async () => {
    const {token} = Config.gitee
    if (isEmpty(token)) return logger.warn('未配置Gitee Token, 跳过任务')
    try {
      const client = Client.gitee()
      handleRepoIssue(client, Platform.Gitee)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const gitcode = karin.task(
  'karin-plugin-git:issue:gitcode',
  Config.gitcode.cron || '0 */5 * * * *',
  async () => {
    const {token} = Config.gitcode
    if (isEmpty(token)) return logger.warn('未配置GitCode Token, 跳过任务')
    try {
      const client = Client.gitcode()
      handleRepoIssue(client, Platform.GitCode)
    } catch (e) {
      logger.error(e)
    }
  },
)

export const cnb = karin.task(
  'karin-plugin-git:issue:cnb',
  Config.cnb.cron || '0 */5 * * * *',
  async () => {
    const {token} = Config.cnb
    if (isEmpty(token)) return logger.warn('未配置CnbCool Token, 跳过任务')
    try {
      const client = Client.cnb()
      handleRepoIssue(client, Platform.Cnb)
    } catch (e) {
      logger.error(e)
    }
  },
)

const handleRepoIssue = async (client: ClientType, platform: Platform) => {
  const all = await db.event.GetAll()
  const repoInfos = all.filter(
    (repo) =>
      repo.platform === platform && repo.eventType.includes(EventType.Issue),
  )
  const groupMap = new Map<
    string,
    Array<{
      owner: string
      repo: string
      title: string
      body?: string | null
      user: IssueUserInfo
      state: StateType
      issueDate: string
    }>
  >()

  for (const repo of repoInfos) {
    const repoInfo = await db.repo.GetRepo(repo.repoId)
    if (!repoInfo) continue
    const groupKey = `${repoInfo.botId}-${repoInfo.groupId}`
    const issueInfos = await client.getIssueList(
      repoInfo.owner,
      repoInfo.repo,
      {
        perPage: 100,
      },
    )
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, [])
    }
    for (const issue of issueInfos) {
      const issueInfo = await db.issue.GetRepo(
        platform,
        repo.repoId,
        issue.number,
      )
      if (!issueInfo) {
        await db.issue.AddRepo(
          platform,
          repo.repoId,
          issue.number,
          make_hash(issue.title),
          issue.body ? make_hash(issue.body) : null,
          issue.state,
        )
        groupMap.get(groupKey)!.push({
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          title: await Render.markdown(issue.title),
          body: issue.body ? await Render.markdown(issue.body) : null,
          user: issue.user,
          state: issue.state,
          issueDate: formatDate(issue.createdAt),
        })
      } else {
        if (
          issueInfo.state !== issue.state ||
          issueInfo.title !== make_hash(issue.title) ||
          issueInfo.body !== (issue.body ? make_hash(issue.body) : null)
        ) {
          groupMap.get(groupKey)!.push({
            owner: repoInfo.owner,
            repo: repoInfo.repo,
            title: await Render.markdown(issue.title),
            body: issue.body ? await Render.markdown(issue.body) : null,
            user: issue.user,
            state: issue.state,
            issueDate: formatDate(issue.createdAt),
          })
        }

        await db.issue.UpdateState(
          platform,
          repo.repoId,
          issue.number,
          issue.state,
        )
      }
    }
  }
  for (const [groupKey, issues] of groupMap) {
    const [botId, groupId] = groupKey.split('-')
    let image: ImageElement[] = []

    for (const issue of issues) {
      const img = await Render.render('issue/index', {
        issue: issue,
      })
      image.push(img)
    }
    if (image.length > 0) {
      await sendImage(botId, groupId, image)
    }
  }
  groupMap.clear()
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
      source: '议题推送合集',
      summary: `查看${res.length}张议题推送消息`,
      prompt: '议题推送结果',
      news: [{ text: '点击查看议题推送结果' }],
    })
  } else {
    await bot?.sendMsg(contact, image)
  }
}
