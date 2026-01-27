import GitCode from '@/assets/icons/gitcode.svg'
import {
  CommitRepo,
  CommitTitle,
  CommitUser,
  CommitBody,
} from '@/components/common/commit'
import { CommitInfo } from '@/types'

export const Commit = ({
  owner,
  repo,
  branch,
  sha,
  author,
  committer,
  title,
  body,
  stats,
  files,
}: CommitInfo) => {
  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center pt-4">
      <CommitTitle title="Gitee 仓库更新推送"></CommitTitle>
      <div className="w-4/5 h-9/10 flex flex-col space-y-4">
        <CommitRepo
          icon={GitCode}
          owner={owner}
          repo={repo}
          branch={branch}
          sha={sha}
        />
        <CommitUser author={author} committer={committer} />
        <CommitBody title={title} body={body} stats={stats} files={files} />
      </div>
    </div>
  )
}
