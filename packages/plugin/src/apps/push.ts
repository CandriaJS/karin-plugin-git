import { db } from '@/models';
import karin, { getBot, logger, contactGroup } from 'node-karin';
import { GithubClient } from 'nipaw';
import { Config, Render } from '@/common';
import { isEmpty } from 'es-toolkit/compat';
import { formatDate } from '@/common/date';
import { PushCommitInfo } from '@/types/push';
import { Platform } from '@/types';

export const github = karin.task(
  'karin-plugin-git:github',
  '*/10 * * * * *',
  async () => {
    const token = Config.github.token;
    if (isEmpty(token)) return logger.warn('未配置GitHub Token, 跳过任务');
    try {
      const client = new GithubClient();
      client.setToken(token);
      const all = await db.github.GetAll();

      const commits = new Map<string, Array<PushCommitInfo>>();

      for (const repo of all) {
        let commitInfo = await client.getCommitInfo(
          repo.owner,
          repo.repo,
          repo.branch,
        );

        const latestSha = commitInfo.sha;


        if (!repo.commitSha || repo.commitSha !== latestSha) {
          const key = `${repo.botId}-${repo.groupId}`;
          if (!commits.has(key)) commits.set(key, []);

          const messageParts = commitInfo.commit.message.split('\n');

          const repoCommitInfo: PushCommitInfo = {
            ...commitInfo,
            owner: repo.owner,
            repo: repo.repo,
            botId: repo.botId,
            groupId: repo.groupId,
            title: messageParts[0],
            body: messageParts.slice(1).join('\n'),
            commitDate: formatDate(commitInfo.commit.author.date),
          };
          commits.get(key)?.push(repoCommitInfo);;

          await db.github.UpdateCommitSha(
            repo.botId,
            repo.groupId,
            repo.owner,
            repo.repo,
            repo.branch,
            latestSha
          );
        }
      }

      for (const [groupKey, commitInfos] of commits) {
        const [botId, groupId] = groupKey.split('-');
        const contact = contactGroup(groupId);
        const bot = getBot(botId);
        const image = await Render.render('commit/index', {
          platform: Platform.GitHub,
          commits: commitInfos,
        });

        await bot?.sendMsg(contact, image);
      }
    } catch (e) {
      logger.error(e);
    }
  },
);
