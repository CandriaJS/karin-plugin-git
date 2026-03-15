import GitCode from '@/assets/icons/gitcode.svg'
import { CommitLayout } from '@/components/layout'
import { CommitInfo } from '@/types'

export const Commit = (props: CommitInfo) => {
  return <CommitLayout platformName="GitCode" platformIcon={GitCode} {...props} />
}

Commit.displayName = 'Commit'
