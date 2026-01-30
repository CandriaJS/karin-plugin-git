import karin, { logger, Message } from 'node-karin'
import { Config, Render } from '@/common'
import { ClientType, Platform } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { client as Client, db } from '@/models'

export const commit = karin.command(
  /^#?(?:git(?:commit|提交信息|提交记录))\s*(\w+)(?::(?:([^\/\s]+)\/([^:\s]+)))?(?::([^\/\s]+))?$/i,
  async (e) => {
    let [, platform, owner, repo, sha] = e.msg.match(commit!.reg)!
    if (!owner || !repo) {
      const bindInfo = await db.bind.GetBind(e.groupId)
      if (!bindInfo) {
        return await e.reply('请先绑定仓库或指定仓库')
      }
      const repoInfo = await db.repo.GetRepo(bindInfo.repoId)
      owner = repoInfo.owner
      repo = repoInfo.repo
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
    const commitClient = client.commit()
    try {
      const commitInfo = await commitClient.info({ owner, repo }, sha)
      const messageParts = commitInfo.commit.message.split('\n')
      const commitType = {
        owner,
        repo,
        sha: commitInfo.sha,
        title: messageParts[0],
        content: messageParts.slice(1).join('\n'),
        stats: commitInfo.stats,
        files: commitInfo.files,
        author: commitInfo.commit.author,
        committer: commitInfo.commit.committer,
        branch: sha,
      }
      const img = await Render.commit(platformType, commitType)
      return await e.reply(img)
    } catch (err) {
      logger.error(
        `获取${platform.toLowerCase()}提交信息出错: ${owner}/${repo}:${sha ? sha : ''} - ${(err as Error).message}`,
      )
      return await e.reply('获取提交信息失败, 请重试')
    }
  },
  {
    name: 'commit:info',
    event: 'message.group',
  },
)
