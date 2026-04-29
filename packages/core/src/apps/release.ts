import karin, { logger } from 'node-karin'
import { Config, Render } from '@/common'
import { ClientType, Platform } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { client as Client, db } from '@/models'

export const release = karin.command(
  /^#?(?:gitrelease|git\s*release|版本发布)\s*(\w+)(?::(?:([^/\s]+)\/([^\s:]+)))?(?::([^\s]+))?$/i,
  async (e) => {
    let [, platform, owner, repo, tagName] = e.msg.match(release!.reg)!
    if (e.isGroup) {
      if (!owner || !repo) {
        const bindInfo = await db.bind.GetBind(e.groupId)
        if (!bindInfo) {
          return await e.reply('请先绑定仓库或指定仓库')
        }
        const repoInfo = await db.repo.GetRepo(bindInfo.repoId)
        owner = repoInfo.owner
        repo = repoInfo.repo
      }
    }
    if (!owner || !repo) {
      return await e.reply('请指定仓库')
    }

    let client: ClientType
    let token: string = Config.token.github
    let platformType: Platform = Platform.GitHub
    switch (platform.toLowerCase()) {
      case 'github':
        platformType = Platform.GitHub
        client = Client.github()
        token = Config.token.github
        break
      case 'gitcode':
        platformType = Platform.GitCode
        client = Client.gitcode()
        token = Config.token.gitcode
        break
      case 'gitee':
        platformType = Platform.Gitee
        client = Client.gitee()
        token = Config.token.gitee
        break
      case 'cnbcool':
        platformType = Platform.CnbCool
        client = Client.cnbcool()
        token = Config.token.cnbcool
        break
      default:
        return await e.reply('未找到该平台, 请重试')
    }
    if (platform.toLowerCase() !== 'github' && isEmpty(token)) {
      return await e.reply('请先配置访问令牌')
    }

    const releaseClient = client.release()
    try {
      const releaseInfo = await releaseClient.info({ owner, repo }, tagName || undefined)
      const releaseData = {
        owner,
        repo,
        tagName: releaseInfo.tagName,
        targetCommitish: releaseInfo.targetCommitish,
        prerelease: releaseInfo.prerelease,
        name: releaseInfo.name,
        body: releaseInfo.body,
        author: releaseInfo.author,
        createdAt: releaseInfo.createdAt,
        assets: releaseInfo.assets,
      }
      const img = await Render.release(platformType, releaseData)
      return await e.reply(img)
    } catch (err) {
      logger.error(
        `获取${platform.toLowerCase()}版本发布信息出错: ${owner}/${repo}:${tagName ? tagName : ''} - ${(err as Error).message}`,
      )
      return await e.reply('获取版本发布信息失败, 请重试')
    }
  },
  {
    name: 'release:info',
    event: 'message',
  },
)
