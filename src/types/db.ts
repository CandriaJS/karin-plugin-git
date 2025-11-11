import { StateType } from 'nipaw'
import type { EventType, Platform } from './index'

export interface RepoInfo {
  id: number
  botId: string
  groupId: string
  owner: string
  repo: string
  createAt: Date
  updateAt: Date
}

export interface EventRepo {
  repoId: number
  platform: Platform
  eventType: Array<EventType>
  createAt: Date
  updateAt: Date
}

export interface PushRepo {
  repoId: number
  platform: Platform
  branch: string
  commitSha: string
  createAt: Date
  updateAt: Date
}

export interface IssueRepo {
  repoId: number
  platform: Platform
  issueId: string
  title: string
  body: string
  state: StateType
  createAt: Date
  updateAt: Date
}
