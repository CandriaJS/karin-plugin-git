import { CommitInfo } from '@/types'
import { IconType } from 'react-icons'
import { FaCodeBranch } from 'react-icons/fa'
import { FiGitCommit } from 'react-icons/fi'

interface CommitRepoProps extends Pick<
  CommitInfo,
  'owner' | 'repo' | 'branch' | 'sha'
> {
  icon: IconType | string
}
export const CommitRepo = ({
  icon,
  owner,
  repo,
  branch,
  sha,
}: CommitRepoProps) => {
  const Icon = icon
  const isSanme = sha === branch
  return (
    <div className="w-full h-18 flex flex-row items-center p-4 bg-blue-200/50 rounded-xl">
      {typeof icon === 'string' ? (
        <img src={icon} className="mr-4 size-10" />
      ) : (
        <Icon className="mr-4 size-10" />
      )}
      <div className="flex">
        <span className="text-xl font-bold">
          {owner}/{repo}
        </span>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        {!isSanme && (
          <>
            <FaCodeBranch />
            <span className="text-gray-600 font-medium">{branch}</span>
          </>
        )}
        <FiGitCommit className="ml-4" />
        <span className="text-gray-600 font-medium">{sha.substring(0, 7)}</span>
      </div>
    </div>
  )
}
