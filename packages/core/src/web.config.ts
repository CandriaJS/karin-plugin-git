import { components, defineConfig } from 'node-karin'
import { Config } from '@/common'
import { db, platform } from '@/models'
import { EventType, Platform } from '@/types'
import { RepoInfo } from '@/types/web'
import { differenceWith } from 'es-toolkit/array'

const PushList = async (platform?: Platform): Promise<RepoInfo[]> => {
  const list = await db.push.GetAll()
  if (!list.length) return []

  const repoIds = [...new Set(list.map((item) => item.repoId))]
  const sessionIds = [...new Set(list.map((item) => item.sessionId))]

  const [allRepos, allSessions] = await Promise.all([
    Promise.all(repoIds.map((id) => db.repo.GetRepo(id))),
    Promise.all(sessionIds.map((id) => db.session.GetSession(id))),
  ])

  const repos = new Map(allRepos.filter(Boolean).map((repo) => [repo.id, repo]))
  const sessions = new Map(
    allSessions.filter(Boolean).map((session) => [session.id, session]),
  )

  return list
    .filter((item) => {
      const repo = repos.get(item.repoId)
      const session = sessions.get(item.sessionId)
      return repo && session && (!platform || repo.platform === platform)
    })
    .map((item) => {
      const repo = repos.get(item.repoId)
      const session = sessions.get(item.sessionId)
      return {
        owner: repo.owner,
        repo: repo.repo,
        botId: session.botId,
        groupId: session.groupId,
        branch: item.branch,
        event: [EventType.Push],
      }
    })
}
const compareRepo = (a: RepoInfo, b: RepoInfo) =>
  a.owner === b.owner &&
  a.repo === b.repo &&
  a.branch === b.branch &&
  a.botId === b.botId &&
  a.groupId === b.groupId

const handleAddRepo = async (repos: RepoInfo[], platform: Platform) => {
  if (!repos.length) return
  await Promise.all(
    repos.map(async (repo) => {
      let [RepoInfo, SessionId] = await Promise.all([
        db.repo.GetRepo(platform, repo.owner, repo.repo),
        db.session.GetSession(repo.botId, repo.groupId),
      ])

      if (!SessionId) {
        await db.session.AddSession(repo.botId, repo.groupId)
        SessionId = await db.session.GetSession(repo.botId, repo.groupId)
      }

      if (!RepoInfo) {
        await db.repo.AddRepo(platform, repo.owner, repo.repo)
        RepoInfo = await db.repo.GetRepo(platform, repo.owner, repo.repo)
      }

      if (repo.event.includes(EventType.Push)) {
        const PushInfo = await db.push.GetPush(
          RepoInfo.id,
          SessionId.id,
          repo.branch,
        )
        if (!PushInfo) {
          await db.push.AddPush(RepoInfo.id, SessionId.id, repo.branch, '')
        }
      }
    }),
  )
}
const handleRemoveRepo = async (repos: RepoInfo[], platform: Platform) => {
  if (!repos.length) return
  await Promise.all(
    repos.map(async (repo) => {
      const [RepoInfo, SessionId] = await Promise.all([
        db.repo.GetRepo(platform, repo.owner, repo.repo),
        db.session.GetSession(repo.botId, repo.groupId),
      ])
      if (!RepoInfo || !SessionId) return
      if (repo.event.includes(EventType.Push)) {
        const PushInfo = await db.push.GetPush(
          RepoInfo.id,
          SessionId.id,
          repo.branch,
        )
        if (PushInfo) {
          await db.push.RemovePush(RepoInfo.id, SessionId.id, repo.branch)
        }
      }
    }),
  )
}

export default defineConfig({
  info: {
    id: '@candriajs/karin-plugin-git',
    name: 'karin-plugin-git',
    author: {
      name: 'CandriaJS',
      home: 'https://github.com/CandriaJS',
      avatar: 'https://avatars.githubusercontent.com/u/196008293?s=200&v=4',
    },
  },
  /** 动态渲染的组件 */
  components: async () => {
    return [
      components.divider.create('divider-1', {
        description: '基础配置',
        descPosition: 50,
      }),
      components.accordion.create('token', {
        label: 'Token 配置',
        children: [
          components.accordion.createItem('config:github', {
            title: 'token 相关',
            subtitle: '建议, 否则大部分功能不可用',
            children: [
              components.input.string('github', {
                label: 'Github',
                description: 'Github 访问令牌',
                placeholder: '请输入 Github 访问令牌',
                defaultValue: Config.token.github,
                isClearable: true,
                isRequired: false,
              }),
              components.input.string('gitee', {
                label: 'Gitee',
                description: 'Gitee 访问令牌',
                placeholder: '请输入 Gitee 访问令牌',
                defaultValue: Config.token.gitee,
                isClearable: true,
                isRequired: false,
              }),
              components.input.string('gitcode', {
                label: 'GitCode',
                description: 'GitCode 访问令牌',
                placeholder: '请输入 GitCode 访问令牌',
                defaultValue: Config.token.gitcode,
                isClearable: true,
                isRequired: false,
              }),
              components.input.string('cnbcool', {
                label: 'CnbCool',
                description: 'CnbCool 访问令牌',
                placeholder: '请输入 CnbCool 访问令牌',
                defaultValue: Config.token.cnbcool,
                isClearable: true,
                isRequired: false,
              }),
            ],
          }),
        ],
      }),
      components.accordion.create('proxy', {
        label: '代理配置',
        children: [
          components.accordion.createItem('config:proxy', {
            title: '代理相关',
            subtitle: '此处用于网络访问请求',
            children: [
              components.input.string('proxy', {
                label: '系统代理',
                description: '系统代理',
                placeholder: '请输入系统代理',
                defaultValue: Config.proxy.proxy,
                isClearable: true,
                isRequired: false,
              }),
              components.input.string('reverseProxy', {
                label: '反向代理',
                description: '反向代理',
                placeholder: '请输入反向代理',
                defaultValue: Config.proxy.reverseProxy,
                isClearable: true,
                isRequired: false,
              }),
            ],
          }),
        ],
      }),
      components.divider.create('divider-2', {
        description: '平台配置',
        descPosition: 50,
      }),
      ...platform.github.web(await PushList(Platform.GitHub)),
      ...platform.gitee.web(await PushList(Platform.Gitee)),
      ...platform.gitcode.web(await PushList(Platform.GitCode)),
      ...platform.cnbcool.web(await PushList(Platform.CnbCool)),
    ]
  },

  /** 前端点击保存之后调用的方法 */
  save: async (config: any) => {
    console.log('config', config)
    const tokenConfig = config.token[0]
    const proxyConfig = config.proxy[0]
    Config.Modify('proxy', 'proxy', proxyConfig.proxy)
    Config.Modify('proxy', 'reverseProxy', proxyConfig.reverseProxy)
    {
      Config.Modify('token', 'github', tokenConfig.github)
      const platform = Platform.GitHub
      const githubConfig = config.github[0]
      const pushList: RepoInfo[] = config['pushlist:github']
      const addRepo = differenceWith(
        pushList,
        await PushList(platform),
        compareRepo,
      )
      const removeRepo = differenceWith(
        await PushList(platform),
        pushList,
        compareRepo,
      )
      await handleAddRepo(addRepo, platform)
      await handleRemoveRepo(removeRepo, platform)
      Config.Modify('github', 'cron', githubConfig.cron)
    }
    {
      Config.Modify('token', 'gitee', tokenConfig.gitee)
      const giteeConfig = config.gitee[0]
      const platform = Platform.GitHub
      Config.Modify('gitee', 'cron', giteeConfig.cron)
      const pushList: RepoInfo[] = config['pushlist:gitee']
      const addRepo = differenceWith(
        pushList,
        await PushList(platform),
        compareRepo,
      )
      const removeRepo = differenceWith(
        await PushList(platform),
        pushList,
        compareRepo,
      )
      await handleAddRepo(addRepo, platform)
      await handleRemoveRepo(removeRepo, platform)
    }
    {
      Config.Modify('token', 'gitcode', tokenConfig.gitcode)
      const gitcodeConfig = config.gitcode[0]
      const platform = Platform.GitCode
      const pushList: RepoInfo[] = config['pushlist:gitcode']
      Config.Modify('gitcode', 'cron', gitcodeConfig.cron)
      const addRepo = differenceWith(
        pushList,
        await PushList(platform),
        compareRepo,
      )
      const removeRepo = differenceWith(
        await PushList(platform),
        pushList,
        compareRepo,
      )
      await handleAddRepo(addRepo, platform)
      await handleRemoveRepo(removeRepo, platform)
    }
    {
      Config.Modify('token', 'cnbcool', tokenConfig.cnbcool)
      const cnbcoolConfig = config.cnbcool[0]
      const platform = Platform.CnbCool
      const pushList: RepoInfo[] = config['pushlist:cnbcool']
      const addRepo = differenceWith(
        pushList,
        await PushList(platform),
        compareRepo,
      )
      const removeRepo = differenceWith(
        await PushList(platform),
        pushList,
        compareRepo,
      )
      await handleAddRepo(addRepo, platform)
      await handleRemoveRepo(removeRepo, platform)
      Config.Modify('cnbcool', 'cron', cnbcoolConfig.cron)
    }

    return {
      success: true,
      message: '保存成功 Ciallo～(∠・ω< )⌒☆',
    }
  },
})
