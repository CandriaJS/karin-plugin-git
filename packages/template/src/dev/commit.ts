import { CommitInfo, FileStatus } from "@/types";

export const commitInfo: CommitInfo = {
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
  body: null,
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