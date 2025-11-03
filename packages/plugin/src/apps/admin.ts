import { db } from '@/models';
import { Platform } from '@/types';
import karin from 'node-karin';

export const AddRepo = karin.command(
  /^#?git(?:添加|add)订阅仓库([^/\s]+)[/\s]([^/\s]+)(?::([^/\s]+))?$/i,
  async (e) => {
    const [, owner, repo, branch] = e.msg.match(AddRepo!.reg)!;
    let botId = e.selfId;
    let groupId = e.groupId;
    let platform = 'github';
    const PushBranch = branch || 'main';
    let repoInfo = await db.repo.GetRepo(botId, groupId, owner, repo);
    if (!repoInfo) {
      await db.repo.AddRepo(botId, groupId, owner, repo);
      repoInfo = await db.repo.GetRepo(botId, groupId, owner, repo);
    }
    if (!repoInfo) return await e.reply('添加仓库失败，请重试');
    const pushRepo = await db.push.GetRepo(
      Platform.GitHub,
      repoInfo.id,
      PushBranch,
    );
    if (!pushRepo) {
      await db.push.AddRepo(Platform.GitHub, repoInfo.id, PushBranch);
      await e.reply(
        `添加订阅仓库成功, 平台: ${platform}, 仓库: ${owner}/${repo}, 分支: ${PushBranch}`,
      );
    } else {
      await e.reply(
        `仓库 ${owner}/${repo} 的推送订阅已存在，平台: ${platform}, 分支: ${PushBranch}`,
      );
    }
  },
  {
    name: 'karin-plugin-git:addRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
);
