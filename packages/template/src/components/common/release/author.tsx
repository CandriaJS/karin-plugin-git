import type { ReleaseInfo } from '@/types'

interface ReleaseAuthorProps {
  author: ReleaseInfo['author']
}

export const ReleaseAuthor = ({ author }: ReleaseAuthorProps) => {
  return (
    <div className="w-full flex items-center px-4 py-2.5 bg-linear-to-r from-emerald-50 to-green-100 rounded-xl shadow-sm border border-green-200/50">
      <img
        className="size-8 rounded-full ring-2 ring-white shadow-sm"
        src={author.avatarUrl}
        alt={author.login}
      />
      <span className="ml-3 text-sm font-medium text-gray-700">{author.login}</span>
    </div>
  )
}
