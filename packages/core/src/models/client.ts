import { Config } from '@/common'
import { isEmpty } from 'es-toolkit/compat'
import { CnbClient, GitCodeClient, GiteeClient, GithubClient } from 'nipaw'

export const github = () => {
  const client = new GithubClient()
  if (!isEmpty(Config.proxy.reverseProxy)) {
    client.setReverseProxy(Config.proxy.reverseProxy)
  } else if (!isEmpty(Config.proxy.proxy)) {
    client.setProxy(Config.proxy.proxy)
  }
  if (!isEmpty(Config.token.github)) {
    client.setToken(Config.token.github)
  }
  return client
}

export const gitee = () => {
  const client = new GiteeClient()
  if (!isEmpty(Config.proxy.proxy)) {
    client.setProxy(Config.proxy.proxy)
  }
  if (!isEmpty(Config.token.gitee)) {
    client.setToken(Config.token.gitee)
  }
  return client
}

export const gitcode = () => {
  const client = new GitCodeClient()
  if (!isEmpty(Config.proxy.proxy)) {
    client.setProxy(Config.proxy.proxy)
  }
  if (!isEmpty(Config.token.gitcode)) {
    client.setToken(Config.token.gitcode)
  }
  return client
}

export const cnbcool = () => {
  const client = new CnbClient()
  if (!isEmpty(Config.proxy.proxy)) {
    client.setProxy(Config.proxy.proxy)
  }
  if (!isEmpty(Config.token.cnbcool)) {
    client.setToken(Config.token.cnbcool)
  }
  return client
}
