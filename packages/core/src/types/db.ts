import { Platform } from './index'

export interface RepoInfo {
  id: number
  platform: Platform
  owner: string
  repo: string
  botId: string
  groupId: string
  createAt: Date
  updateAt: Date
}

export interface PushRepo {
  id: number
  repoId: number
  branch: string
  commitSha: string
  createAt: Date
  updateAt: Date
}
