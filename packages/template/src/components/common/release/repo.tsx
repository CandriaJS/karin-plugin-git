import { ReleaseInfo } from '@/types'
import { IconType } from 'react-icons'
import { FaTag } from 'react-icons/fa'

interface ReleaseRepoProps extends Pick<
  ReleaseInfo,
  'owner' | 'repo' | 'tagName'
> {
  icon: IconType | string
}

export const ReleaseRepo = ({ icon, owner, repo, tagName }: ReleaseRepoProps) => {
  const Icon = icon

  return (
    <div className="w-full flex items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200/50">
      {typeof icon === 'string' ? (
        <img src={icon} alt="Platform icon" className="mr-4 size-10 shrink-0" />
      ) : (
        <Icon className="mr-4 size-10 shrink-0" />
      )}
      <div className="flex items-center min-w-0">
        <span className="text-2xl font-bold font-[MapleMono-Bold] truncate">
          {owner}/{repo}
        </span>
      </div>
      <div className="ml-auto flex items-center shrink-0">
        <div className="flex items-center space-x-1.5 bg-white/60 px-2.5 py-1 rounded-lg">
          <FaTag className="text-sm" />
          <span className="text-gray-700 font-medium text-sm font-mono">{tagName}</span>
        </div>
      </div>
    </div>
  )
}
