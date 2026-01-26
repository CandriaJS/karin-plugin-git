import type { CommitUserInfo, StatsInfo } from "nipaw"



export interface CommitInfo {
  owner: string
  repo: string
  branch: string
  sha: string
  author: Omit<CommitUserInfo, 'email'>
  committer: Omit<CommitUserInfo, 'email'>
  title: string
  body?: string | null
  stats: StatsInfo
  files: Array<FileInfo>
}

export interface FileInfo {
  /** 文件名 */
  fileName: string
  /** 文件状态 */
  status: FileStatus
  /** 新增行数 */
  additions: number
  /** 删除行数 */
  deletions: number
  /** 修改行数 */
  changes: number
}

export enum FileStatus {
  /** 新增文件 */
  Added = 0,
  /** 修改文件 */
  Modified = 1,
  /** 删除文件 */
  Deleted = 2,
  /** 重命名文件 */
  Renamed = 3,
  /** 复制文件 */
  Copied = 4,
  /** 文件已变更 */
  Changed = 5,
  /** 文件未变更 */
  UnChanged = 6
}