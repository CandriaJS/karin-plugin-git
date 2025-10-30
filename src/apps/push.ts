import { db } from '@/models';
import karin, { getBot, logger, contactGroup, segment } from 'node-karin';
import { GitHubClient } from 'nipaw';
import { Config } from '@/common';
import { isEmpty } from 'es-toolkit/compat';

export const github = karin.task(
  'karin-plugin-git:github',
  '*/10 * * * * *',
  async () => {
    if (isEmpty(Config.token.github))
      return logger.warn('未配置GitHub Token, 跳过任务');
    const client = new GitHubClient();
    client.setToken(Config.token.github);
    const all = await db.github.GetAll();

    for (const repo of all) {
      if (isEmpty(repo.defaultBranch)){
        const defaultBranch = await client.getRepoDefaultBranch(
          repo.owner,
          repo.repo,
        );
        await db.github.UpdateDefaultBranch(
          repo.botId,
          repo.groupId,
          repo.owner,
          repo.repo,
          defaultBranch,
        );
      }
      let defaultBranch = await db.github.GetRepoDefaultBranch(
        repo.botId,
        repo.groupId,
        repo.owner,
        repo.repo,
      );
      let commitInfo = await client.getCommitInfo(
        repo.owner,
        repo.repo,
        defaultBranch as string,
      );
      const latestSha = commitInfo.sha;

      if (!repo.commitSha || repo.commitSha !== latestSha) {
        await db.github.UpdateCommitSha(
          repo.botId,
          repo.groupId,
          repo.owner,
          repo.repo,
          latestSha,
        );
        const contact = contactGroup(repo.groupId);
        const bot = getBot(repo.botId);
        await bot?.sendMsg(contact, [
          segment.text(`${repo.owner}/${repo.repo} 更新了`),
        ]);
      }
    }
  },
);
