import karin from 'node-karin';
import { Render } from '@/common';
import { CommitInfo } from 'nipaw';
import { formatDate } from '@/common/date';

export const test = karin.command(/^#?(?:(test))/i, async (e) => {
  let commit: CommitInfo = {
    sha: '1234567890',
    commit: {
      author: {
        name: 'test',
        email: 'test@example.com',
        date: new Date(1704067200000),
        avatarUrl: 'https://example.com/avatar.png',
      },
      committer: {
        name: 'test',
        email: 'test@example.com',
        date: new Date(1704067200000),
        avatarUrl: 'https://example.com/avatar.png',
      },
      message: 'test',
    },
    stats: {
      total: 1,
      additions: 1,
      deletions: 1,
    },
  };

  let image = await Render.render('commit/index', {
    platform: 'github',
    owner: 'puniyu',
    repo: 'puniyu',
    title: 'test',
    commitDate: formatDate(commit.commit.author.date),
    commits: [commit],
  });
  await e.reply(image);
});
