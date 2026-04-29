import GitCode from '@/assets/icons/gitcode.svg'
import { ReleaseLayout } from '@/components/layout'
import { ReleaseInfo } from '@/types'

export const Release = (props: ReleaseInfo) => {
  return <ReleaseLayout platformName="GitCode" platformIcon={GitCode} {...props} />
}

Release.displayName = 'Release'
