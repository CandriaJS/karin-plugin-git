import karin, { logger, Message } from 'node-karin'
import { Client, Config, Render } from '@/common'
import { ClientType } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { Platform } from '@candriajs/template'

export const commit = karin.command(
  /^#?(?:git(?:commit|提交信息)):(\w+):([^\/\s]+)\/([^:\s]+)(?::([^\/\s]+))?$/i,
  async (e: Message) => {
    const [, platform, owner, repo, sha] = e.msg.match(commit!.reg)!
    console.log(platform, owner, repo, sha)
    let client: ClientType
    let token: string | null = null
    let platformType: Platform = Platform.GitHub
    switch (platform.toLowerCase()) {
      case 'github':
        platformType = Platform.GitHub
        client = Client.github()
        token = Config.github.token
        break
      case 'gitcode':
        platformType = Platform.GitCode
        client = Client.gitcode()
        token = Config.gitcode.token
        break
      case 'gitee':
        platformType = Platform.Gitee
        client = Client.gitee()
        token = Config.gitee.token
        break
      case 'cnbcool':
        platformType = Platform.CnbCool
        client = Client.cnbcool()
        token = Config.cnbcool.token
        break
      default:
        platformType = Platform.GitHub
        client = Client.github()
        token = Config.github.token
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
        sha,
        title: messageParts[0],
        body: messageParts.slice(1).join('\n'),
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
        `获取提交信息出错: ${owner}/${repo}:${sha} - ${(err as Error).message}`,
      )
      return await e.reply('未找到指定提交信息')
    }
  },
)
