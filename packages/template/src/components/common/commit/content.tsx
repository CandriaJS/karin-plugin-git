import { CommitInfo } from '@/types'
import { Separator } from '@heroui/react'
import MarkdownIt from 'markdown-it'
import { full as emoji } from 'markdown-it-emoji'
import { tasklist } from '@mdit/plugin-tasklist'

const markdown = (markdown: string) => {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
  })
  md.use(emoji)
  md.use(tasklist)
  md.renderer.rules.bullet_list_open = () => '<ul style="list-style: none;">'
  return md.render(markdown)
}

const Title = ({ title }: Pick<CommitInfo, 'title'>) => {
  return (
    <div className="w-full flex-1 items-center ml-4 my-2">
      <span className="text-md">{title}</span>
    </div>
  )
}

const Stat = ({ stats, files }: Pick<CommitInfo, 'stats' | 'files'>) => {
  return (
    <div className="flex items-center ml-auto mr-4 text-sm space-x-1">
      <span className="text-green-600">+{stats.additions}</span>

      <span className="text-red-600">-{stats.deletions}</span>

      <span className="text-gray-400">•</span>

      <span className="text-gray-600">{files.length} 个文件被更改</span>
    </div>
  )
}

export const Content = ({
  title,
  content,
  stats,
  files,
}: Pick<CommitInfo, 'title' | 'content' | 'stats' | 'files'>) => {
  return (
    <div className="w-full min-h-20 flex flex-col bg-pink-100 rounded-xl">
      <div className="w-full flex items-center">
        <Title title={title} />
        <Stat stats={stats} files={files} />
      </div>
      <Separator className="bg-gray-400" />
      <div className="w-full px-4 py-2">
        {content && (
          <div className="text-gray-700 whitespace-pre-line">
            <div dangerouslySetInnerHTML={{ __html: markdown(content) }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
