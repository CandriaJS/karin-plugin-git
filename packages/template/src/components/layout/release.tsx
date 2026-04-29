import { ReleaseInfo } from '@/types'
import { IconType } from 'react-icons'
import { ReleaseRepo } from '@/components/common/release'
import { ReleaseContent } from '@/components/common/release'
import { ReleaseAuthor } from '@/components/common/release'

interface ReleaseLayoutProps extends ReleaseInfo {
  platformName: string
  platformIcon: IconType | string
}

export const ReleaseLayout = ({
  platformName,
  platformIcon,
  owner,
  repo,
  tagName,
  name,
  body,
  author,
  assets,
}: ReleaseLayoutProps) => {
  return (
    <div className="w-screen min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center py-6 px-4">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          {platformName} 版本发布
        </h1>
      </div>
      <div className="w-full max-w-5xl flex flex-col space-y-4">
        <ReleaseRepo
          icon={platformIcon}
          owner={owner}
          repo={repo}
          tagName={tagName}
        />
        <ReleaseContent name={name} body={body} assets={assets} />
        <ReleaseAuthor author={author} />
      </div>
    </div>
  )
}
