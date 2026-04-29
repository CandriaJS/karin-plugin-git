import type { ReleaseInfo } from '@/types'

export const releaseInfo: ReleaseInfo = {
  owner: 'CandriaJS',
  repo: 'karin-plugin-git',
  tagName: 'v1.0.0',
  targetCommitish: 'main',
  prerelease: false,
  name: '首次发布版本',
  body: `## 更新内容

- 新增 GitHub 推送功能
- 支持多平台仓库订阅
- 优化通知推送体验

## 修复内容

- 修复了一些已知问题`,
  author: {
    login: 'wuliya',
    avatarUrl: 'https://avatars.githubusercontent.com/u/71247360?v=4',
  },
  createdAt: new Date('2026-01-24T14:55:27Z'),
  assets: [
    {
      name: 'karin-plugin-git-v1.0.0.zip',
      url: 'https://github.com/CandriaJS/karin-plugin-git/releases/download/v1.0.0/karin-plugin-git-v1.0.0.zip',
    },
    {
      name: 'karin-plugin-git-v1.0.0.tar.gz',
      url: 'https://github.com/CandriaJS/karin-plugin-git/releases/download/v1.0.0/karin-plugin-git-v1.0.0.tar.gz',
    },
  ]
}
