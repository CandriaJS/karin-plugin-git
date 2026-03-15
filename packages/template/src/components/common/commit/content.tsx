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

interface TitleProps {
  title: CommitInfo['title']
}

const Title = ({ title }: TitleProps) => {
  return (
    <div className="w-full flex items-center px-4 pt-3 pb-2">
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </div>
  )
}

interface StatProps {
  stats: CommitInfo['stats']
  files: CommitInfo['files']
}

const Stat = ({ stats, files }: StatProps) => {
  return (
    <div className="flex items-center px-4 pt-3 pb-2 text-sm space-x-2">
      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium">
        <span>+{stats.additions}</span>
      </div>
      <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-medium">
        <span>-{stats.deletions}</span>
      </div>
      <span className="text-gray-400">•</span>
      <span className="text-gray-600 font-medium">{files.length} 个文件被更改</span>
    </div>
  )
}

interface ContentProps {
  title: CommitInfo['title']
  content: CommitInfo['content']
  stats: CommitInfo['stats']
  files: CommitInfo['files']
}

export const Content = ({ title, content, stats, files }: ContentProps) => {
  return (
    <div className="w-full min-h-20 flex flex-col bg-linear-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200/50">
      <div className="w-full flex flex-col">
        <Title title={title} />
        <Stat stats={stats} files={files} />
      </div>
      <Separator className="bg-purple-200/50" />
      {content && (
        <div className="w-full px-4 py-3">
          <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: markdown(content) }} />
          </div>
        </div>
      )}
    </div>
  )
}
