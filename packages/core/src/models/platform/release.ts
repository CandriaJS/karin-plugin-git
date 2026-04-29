import { db } from '@/models'
import { ClientType, Platform } from '@/types'
import { getBot, contactGroup, logger } from 'node-karin'
import { Render } from '@/common'
import { ReleaseInfo as ReleaseDataType } from '@candriajs/template'

export abstract class BaseRelease {
  protected platform: Platform
  protected client: ClientType

  constructor(platform: Platform, client: ClientType) {
    this.platform = platform
    this.client = client
  }

  public async action() {
    const [allRepos, allReleases] = await Promise.all([
      db.repo.GetAll(),
      db.release.GetAll(),
    ])
    const repoIds = allRepos
      .filter((repo) => repo.platform === this.platform)
      .map((repo) => repo.id)
    const ReleaseList = allReleases.filter((release) => repoIds.includes(release.repoId))
    const releaseClient = this.client.release()

    for (const release of ReleaseList) {
      const repoInfo = await db.repo.GetRepo(release.id)
      if (!repoInfo) continue

      logger.debug(
        `开始处理 ${this.platform} ${repoInfo.owner}/${repoInfo.repo} Release`,
      )

      const sessionInfo = await db.session.GetSession(release.sessionId)
      if (!sessionInfo) continue

      const releaseInfo = await releaseClient.info({
        owner: repoInfo.owner,
        repo: repoInfo.repo,
      })

      if (releaseInfo.tagName === release.tagName) continue

      const bot = getBot(sessionInfo.botId)
      if (!bot) {
        logger.warn(`Bot ${sessionInfo.botId} not found`)
        continue
      }

      const releaseData: ReleaseDataType = {
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        tagName: releaseInfo.tagName,
        targetCommitish: releaseInfo.targetCommitish,
        prerelease: releaseInfo.prerelease,
        name: releaseInfo.name,
        body: releaseInfo.body,
        author: releaseInfo.author,
        createdAt: releaseInfo.createdAt,
        assets: releaseInfo.assets,
      }

      const img = await Render.release(this.platform, releaseData)
      const contact = contactGroup(sessionInfo.groupId)
      await bot.sendMsg(contact, [img])

      await db.release.RemoveRelease(release.repoId, release.sessionId)
      await db.release.AddRelease(release.repoId, release.sessionId, releaseInfo.tagName)
    }
  }
}
