import CnbCool from '@/assets/icons/cnbcool.svg'
import { ReleaseLayout } from '@/components/layout'
import { ReleaseInfo } from '@/types'

export const Release = (props: ReleaseInfo) => {
  return <ReleaseLayout platformName="CnbCool" platformIcon={CnbCool} {...props} />
}

Release.displayName = 'Release'
