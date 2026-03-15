import { CommitInfo } from '@/types'
import { toRelativeTime } from '@/utils/time'

interface UserProps {
  author: CommitInfo['author']
  committer: CommitInfo['committer']
}

export const User = ({ author, committer }: UserProps) => {
  const isSame = author.name === committer.name

  return (
    <div className="flex items-center text-sm text-gray-800 bg-linear-to-r from-emerald-50 to-green-100 w-full px-4 py-3 rounded-xl shadow-sm border border-green-200/50">
      <div className="flex items-center space-x-2.5">
        {isSame ? (
          <>
            <img
              className="size-9 rounded-full ring-2 ring-white shadow-sm"
              src={author.avatarUrl}
              alt={author.name}
            />
            <span className="font-medium">由 <span className="text-green-700">{author.name}</span> 提交</span>
          </>
        ) : (
          <>
            <div className="flex -space-x-2">
              <img
                className="size-9 rounded-full ring-2 ring-white shadow-sm"
                src={author.avatarUrl}
                alt={author.name}
              />
              <img
                className="size-9 rounded-full ring-2 ring-white shadow-sm"
                src={committer.avatarUrl}
                alt={committer.name}
              />
            </div>
            <span className="font-medium">
              由 <span className="text-green-700">{author.name}</span> 编写，并由 <span className="text-green-700">{committer.name}</span> 提交
            </span>
          </>
        )}
      </div>

      <span className="ml-auto text-xs text-gray-500 font-medium bg-white/60 px-2.5 py-1 rounded-lg">
        {toRelativeTime(author.date)}
      </span>
    </div>
  )
}
