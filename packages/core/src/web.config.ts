import { components, defineConfig } from 'node-karin'
import { Config } from '@/common'
import { platform } from '@/models'

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
  components: () => [
    // 基本调用方法
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
    ...platform.github.web(),
    ...platform.gitee.web(),
    ...platform.gitcode.web(),
    ...platform.cnbcool.web(),
  ],

  /** 前端点击保存之后调用的方法 */
  save: (config: any) => {
    console.log('config', config)
    const tokenConfig = config.token[0]
    Config.Modify('token', 'github', tokenConfig.github)
    Config.Modify('token', 'gitee', tokenConfig.gitee)
    Config.Modify('token', 'gitcode', tokenConfig.gitcode)
    Config.Modify('token', 'cnbcool', tokenConfig.cnbcool)
    const proxyConfig = config.proxy[0]
    Config.Modify('proxy', 'proxy', proxyConfig.proxy)
    Config.Modify('proxy', 'reverseProxy', proxyConfig.reverseProxy)
    {
      const githubConfig = config.github[0]
      const _pushRepoList: string[] = githubConfig.pushList;
      Config.Modify('github', 'cron', githubConfig.cron)
    }
    {
      const giteeConfig = config.gitee[0]
      Config.Modify('gitee', 'cron', giteeConfig.cron)
    }
    {
      const gitcodeConfig = config.gitcode[0]
      Config.Modify('gitcode', 'cron', gitcodeConfig.cron)
    }

    return {
      success: true,
      message: '保存成功',
    }
  },
})


