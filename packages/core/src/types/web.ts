import { EventType } from './index'

export interface RepoInfo {
  owner: string
  repo: string
  botId: string
  groupId: string
  branch: string
  event: EventType[]
}
