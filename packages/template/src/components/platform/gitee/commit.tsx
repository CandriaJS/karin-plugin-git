import Gitee from '@/assets/icons/gitee.svg'
import { CommitLayout } from '@/components/layout'
import { CommitInfo } from '@/types'

export const Commit = (props: CommitInfo) => {
  return <CommitLayout platformName="Gitee" platformIcon={Gitee} {...props} />
}

Commit.displayName = 'Commit'