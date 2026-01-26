import { CommitInfo } from 'nipaw'

export interface PushCommitInfo extends CommitInfo {
  owner: string
  repo: string
  branch: string
  botId: string
  groupId: string
  title: string
  body?: string
  commitDate: string
}
