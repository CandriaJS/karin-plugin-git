import { CommitInfo } from '@/types'
import { IconType } from 'react-icons'
import { Repo, User, Content } from '@/components/common/commit'

interface CommitLayoutProps extends CommitInfo {
  platformName: string
  platformIcon: IconType | string
}

export const CommitLayout = ({
  platformName,
  platformIcon,
  owner,
  repo,
  branch,
  sha,
  author,
  committer,
  title,
  content,
  stats,
  files,
}: CommitLayoutProps) => {
  return (
    <div className="w-screen min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center py-6 px-4">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          {platformName} 仓库更新推送
        </h1>
      </div>
      <div className="w-full max-w-5xl flex flex-col space-y-4">
        <Repo
          icon={platformIcon}
          owner={owner}
          repo={repo}
          branch={branch}
          sha={sha}
        />
        <User author={author} committer={committer} />
        <Content title={title} content={content} stats={stats} files={files} />
      </div>
    </div>
  )
}
