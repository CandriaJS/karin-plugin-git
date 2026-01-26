import { CommitInfo } from '@/types'
import { Separator } from '@heroui/react'

const CommitTitle = ({ title }: Pick<CommitInfo, 'title'>) => {
  return (
    <div className="w-full flex-1 items-center ml-4 my-2">
      <span className="text-md">{title}</span>
    </div>
  )
}

const CommitStats = ({ stats, files }: Pick<CommitInfo, 'stats' | 'files'>) => {
  return (
    <div className="flex items-center ml-auto mr-4 text-sm space-x-1">
      <span className="text-green-600">+{stats.additions}</span>

      <span className="text-red-600">-{stats.deletions}</span>

      <span className="text-gray-400">•</span>

      <span className="text-gray-600">{files.length} 个文件被更改</span>
    </div>
  )
}

export const CommitBody = ({
  title,
  body,
  stats,
  files,
}: Pick<CommitInfo, 'title' | 'body' | 'stats' | 'files'>) => {
  return (
    <div className="w-full min-h-20 flex flex-col bg-pink-100 rounded-xl">
      <div className="w-full flex items-center">
        <CommitTitle title={title} />
        <CommitStats stats={stats} files={files} />
      </div>
      <Separator className="my-2 bg-gray-400" />
      <div className="w-full px-4 py-2">
        {body && (
          <span className="text-gray-700 whitespace-pre-line">{body}</span>
        )}
      </div>
    </div>
  )
}
