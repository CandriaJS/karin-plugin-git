import Gitee from '@/assets/icons/gitee.svg'
import { ReleaseLayout } from '@/components/layout'
import { ReleaseInfo } from '@/types'

export const Release = (props: ReleaseInfo) => {
  return <ReleaseLayout platformName="Gitee" platformIcon={Gitee} {...props} />
}

Release.displayName = 'Release'
