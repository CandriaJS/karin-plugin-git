import karin, { Message } from 'node-karin'
import { Render } from '@/common'
import { FileStatus, github } from '@candriajs/template'

export const test = karin.command('test', async (e: Message) => {
  const commitInfo = {
  owner: 'puniyu',
  repo: 'puniyu',
  branch: 'main',
  sha: '92010e7213f895bd13ae6b5c8f55cabe3e9bbe23',
  author: {
    name: 'renovate[bot]',
    avatarUrl: 'https://avatars.githubusercontent.com/in/2740?v=4',
    date: new Date('2026-01-24T14:55:27Z'),
  },
  committer: {
    name: 'wuliya',
    avatarUrl: 'https://avatars.githubusercontent.com/u/71247360?v=4',
    date: new Date('2026-01-24T15:15:30Z'),
  },
  title: 'chore(deps): bump dependencies',
  stats: {
    total: 37,
    additions: 26,
    deletions: 11,
  },
  files: [
    {
      fileName: 'Cargo.lock',
      status: FileStatus.Modified,
      additions: 25,
      deletions: 10,
      changes: 35,
    },
    {
      fileName: 'crates/puniyu_config/Cargo.tomlk',
      status: FileStatus.Modified,
      additions: 1,
      deletions: 1,
      changes: 2,
    },
  ],
}
  const img = await Render.render(
    github.Commit({ ...commitInfo
    }),
    "commit"
  )
  await e.reply(img)
})
