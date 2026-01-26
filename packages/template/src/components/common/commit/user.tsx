import { CommitUserInfo } from 'nipaw'
import { Avatar } from '@heroui/react'
import { toRelativeTime } from '@/utils/time'

export const CommitUser = ({
  author,
  committer,
}: {
  author: CommitUserInfo
  committer: CommitUserInfo
}) => {
  const isSame = author.name === committer.name

  return (
    <div className="flex text-sm text-gray-800 bg-green-200 w-full h-12 rounded-xl">
      <div className="flex items-center ml-4 space-x-2">
        {isSame ? (
          <>
            <Avatar size="sm">
              <Avatar.Image alt="author" src={author.avatarUrl} />
              <Avatar.Fallback>{author.name.charAt(0)}</Avatar.Fallback>
            </Avatar>
            <span>由 {author.name} 提交</span>
          </>
        ) : (
          <>
            <div className="flex -space-x-2">
              <Avatar size="sm">
                <Avatar.Image alt="author" src={author.avatarUrl} />
                <Avatar.Fallback>{author.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
              <Avatar size="sm">
                <Avatar.Image alt="committer" src={committer.avatarUrl} />
                <Avatar.Fallback>{committer.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
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
