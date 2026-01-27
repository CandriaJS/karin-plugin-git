import { CommitInfo } from '@/types'
import { toRelativeTime } from '@/utils/time'

export const CommitUser = ({
  author,
  committer,
}: {
  author: CommitInfo['author']
  committer: CommitInfo['committer']
}) => {
  const isSame = author.name === committer.name

  return (
    <div className="flex text-sm text-gray-800 bg-green-200 w-full h-12 rounded-xl">
      <div className="flex items-center ml-4 space-x-2">
        {isSame ? (
          <>
            <img className='size-8 rounded-full' src={author.avatarUrl}></img>
            <span>由 {author.name} 提交</span>
          </>
        ) : (
          <>
            <div className="flex -space-x-2">
              <img className='size-8 rounded-full' src={author.avatarUrl}></img>
              <img className='size-8 rounded-full' src={committer.avatarUrl}></img>
            </div>
            <span>
              由 {author.name} 编写，并由 {committer.name} 提交
            </span>
          </>
        )}
      </div>

      <span className="ml-auto mr-4 text-xs text-gray-400 flex items-center">
        {toRelativeTime(author.date)}
      </span>
    </div>
  )
}
