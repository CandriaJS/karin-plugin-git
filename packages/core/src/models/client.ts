import { Config } from '@/common'
import { isEmpty } from 'es-toolkit/compat'
import { CnbClient, GitCodeClient, GiteeClient, GithubClient } from 'nipaw'

export const github = () => {
  const client = new GithubClient()
  if (!isEmpty(Config.github.reverseProxy)) {
    client.setReverseProxy(Config.github.reverseProxy)
  } else if (!isEmpty(Config.github.proxy)) {
    client.setProxy(Config.github.proxy)
  }
  if (!isEmpty(Config.github.token)) {
    client.setToken(Config.github.token)
  }
  return client
}

export const gitee = () => {
  const client = new GiteeClient()
  if (!isEmpty(Config.gitee.proxy)) {
    client.setProxy(Config.gitee.proxy)
  }
  if (!isEmpty(Config.gitee.token)) {
    client.setToken(Config.gitee.token)
  }
  return client
}

export const gitcode = () => {
  const client = new GitCodeClient()
  if (!isEmpty(Config.gitcode.proxy)) {
    client.setProxy(Config.gitcode.proxy)
  }
  if (!isEmpty(Config.gitcode.token)) {
    client.setToken(Config.gitcode.token)
  }
  return client
}

export const cnbcool = () => {
  const client = new CnbClient()
  if (!isEmpty(Config.cnbcool.proxy)) {
    client.setProxy(Config.cnbcool.proxy)
  }
  if (!isEmpty(Config.cnbcool.token)) {
    client.setToken(Config.cnbcool.token)
  }
  return client
}
