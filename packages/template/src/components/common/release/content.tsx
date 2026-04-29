import type { ReleaseInfo } from '@/types'
import { Separator } from '@heroui/react'
import MarkdownIt from 'markdown-it'
import { full as emoji } from 'markdown-it-emoji'
import { tasklist } from '@mdit/plugin-tasklist'
import { FaRegFile  } from 'react-icons/fa'

const markdown = (md: string) => {
  const m = new MarkdownIt({
    html: true,
    breaks: true,
  })
  m.use(emoji)
  m.use(tasklist)
  m.renderer.rules.bullet_list_open = () => '<ul style="list-style: none;">'
  return m.render(md)
}

const ReleaseBody = ({ body }: Pick<ReleaseInfo, 'body'>) => {
  if (!body) return null
  return (
    <div className="w-full px-4 py-3">
      <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: markdown(body) }} />
      </div>
    </div>
  )
}

const AssetList = ({ assets }: Pick<ReleaseInfo, 'assets'>) => {
  if (!assets.length) return null

  return (
    <div className="w-full min-h-20 flex flex-col bg-linear-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200/50">
      <div className="w-full flex items-center px-4 pt-3 pb-2">
        <span className="text-sm font-semibold text-gray-800">资产列表</span>
        <span className="ml-2 text-xs text-gray-500">({assets.length} 个文件)</span>
      </div>
      <Separator className="bg-amber-200/50" />
      <div className="w-full px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {assets.map((asset) => (
            <div
              key={asset.name}
              className="flex items-center space-x-1.5 bg-white/60 border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              <FaRegFile  className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-sm text-gray-700">{asset.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ReleaseContentProps {
  name: string
  body?: string
  assets: Array<ReleaseInfo['assets'][number]>
}

export const ReleaseContent = ({ name, body, assets }: ReleaseContentProps) => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full min-h-20 flex flex-col bg-linear-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200/50">
        <div className="w-full flex items-center px-4 pt-3 pb-2">
          <span className="text-lg font-semibold text-gray-800">{name}</span>
        </div>
        <Separator className="bg-purple-200/50" />
        <ReleaseBody body={body} />
      </div>
      <AssetList assets={assets} />
    </div>
  )
}
