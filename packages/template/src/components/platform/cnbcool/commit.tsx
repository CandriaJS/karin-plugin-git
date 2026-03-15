import CnbCool from '@/assets/icons/cnbcool.svg'
import { CommitLayout } from '@/components/layout'
import { CommitInfo } from '@/types'

export const Commit = (props: CommitInfo) => {
  return <CommitLayout platformName="CnbCool" platformIcon={CnbCool} {...props} />
}

Commit.displayName = 'Commit'
