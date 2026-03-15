import { FaGithub } from 'react-icons/fa'
import { CommitLayout } from '@/components/layout'
import { CommitInfo } from '@/types'

export const Commit = (props: CommitInfo) => {
  return <CommitLayout platformName="Github" platformIcon={FaGithub} {...props} />
}

Commit.displayName = 'Commit'
