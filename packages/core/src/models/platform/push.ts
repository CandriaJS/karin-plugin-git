import { db } from '@/models'
import { ClientType, Platform } from '@/types'
import { getBot, contactGroup, logger } from 'node-karin'
import { Render } from '@/common'
import { CommitInfo as CommitDataType } from '@candriajs/template'

export abstract class BasePush {
  protected platform: Platform
  protected client: ClientType

  constructor(platform: Platform, client: ClientType) {
    this.platform = platform
    this.client = client
  }

  public async action() {
    const [allRepos, allPushes] = await Promise.all([
      db.repo.GetAll(),
      db.push.GetAll(),
    ])
    const repoIds = allRepos
      .filter((repo) => repo.platform === this.platform)
      .map((repo) => repo.id)
    const PushList = allPushes.filter((push) => repoIds.includes(push.repoId))
    const commit = this.client.commit()
    PushList.forEach(async (push) => {
      const repoInfo = await db.repo.GetRepoById(push.id)
      logger.debug(
        `开始处理 ${this.platform} ${repoInfo.owner}/${repoInfo.repo} ${push.branch}}`,
      )
      const commitInfo = await commit.info(
        {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
        },
        push.branch,
      )
      if (commitInfo.sha === push.commitSha) return
      const bot = getBot(repoInfo.botId)
      if (!bot) throw new Error(`Bot ${repoInfo.botId} not found`)

      const messageParts = commitInfo.commit.message.split('\n')
      const commitData: CommitDataType = {
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        branch: push.branch,
        sha: commitInfo.sha,
        author: commitInfo.commit.author,
        committer: commitInfo.commit.committer,
        title: messageParts[0],
        content: messageParts.slice(1).join('\n'),
        stats: commitInfo.stats,
        files: commitInfo.files,
      }
      const img = await Render.commit(this.platform, commitData)
      const contact = contactGroup(repoInfo.groupId)
      await bot.sendMsg(contact, [img])
      await db.push.UpdatePush(push.id, push.branch, commitInfo.sha)
    })
  }
}
