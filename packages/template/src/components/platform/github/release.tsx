import { FaGithub } from 'react-icons/fa'
import { ReleaseLayout } from '@/components/layout'
import { ReleaseInfo } from '@/types'

export const Release = (props: ReleaseInfo) => {
  return <ReleaseLayout platformName="Github" platformIcon={FaGithub} {...props} />
}

Release.displayName = 'Release'
