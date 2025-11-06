import { Config } from '@/common'
import { isEmpty } from 'es-toolkit/compat'
import { GithubClient } from 'nipaw'

export const github = () => {
  const client = new GithubClient()
  if (!isEmpty(Config.github.proxy)) {
    client.setProxy(Config.github.proxy)
  }
  if (!isEmpty(Config.github.token)) {
    client.setToken(Config.github.token)
  }
  return client
}
