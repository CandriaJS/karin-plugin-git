import { Platform } from './index'

export interface RepoInfo {
  id: number
  platform: Platform
  owner: string
  repo: string
  createAt: Date
  updateAt: Date
}

export interface SessionInfo {
  id: number
  botId: string
  groupId: string
  createAt: Date
  updateAt: Date
}

export interface BindInfo {
  id: number
  groupId: string
  repoId: number
  createAt: Date
  updateAt: Date
}

export interface PushInfo {
  id: number
  repoId: number
  sessionId: number
  branch: string
  commitSha: string
  createAt: Date
  updateAt: Date
}
