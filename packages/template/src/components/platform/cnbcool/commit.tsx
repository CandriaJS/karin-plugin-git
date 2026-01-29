import CnbCool from '@/assets/icons/cnbcool.svg'
import { Repo, User, Content } from '@/components/common/commit'
import { CommitInfo } from '@/types'

export const Commit = ({
  owner,
  repo,
  branch,
  sha,
  author,
  committer,
  title,
  content: body,
  stats,
  files,
}: CommitInfo) => {
  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center pt-4">
      <div className="flex justify-center items-center h-16">
        <span className="text-2xl font-bold">CnbColl 仓库更新推送</span>
      </div>
      <div className="w-4/5 h-9/10 flex flex-col space-y-4">
        <Repo
          icon={CnbCool}
          owner={owner}
          repo={repo}
          branch={branch}
          sha={sha}
        />
        <User author={author} committer={committer} />
        <Content title={title} content={body} stats={stats} files={files} />
      </div>
    </div>
  )
}
Commit.displayName = 'Commit'
