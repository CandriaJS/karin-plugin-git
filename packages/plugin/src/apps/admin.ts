import { db } from '@/models';
import karin from 'node-karin';

export const AddRepo = karin.command(
  /^#?git(?:添加|add)订阅仓库([^/\s]+)[/\s]([^/\s]+)(?::([^/\s]+))?$/i,
  async (e) => {
    const [, owner, repo, branch] = e.msg.match(AddRepo!.reg)!;
    let botId = e.selfId;
    let groupId = e.groupId;
    let platform = 'github';
    let defaultBranch = 'main';
    if (!branch) defaultBranch = 'main';
    else defaultBranch = branch;
    await db.github.AddRepo(botId, groupId, owner, repo, defaultBranch);
    await e.reply(
      `添加订阅仓库成功, 平台: ${platform}, 仓库: ${owner}/${repo}${branch ? `, 分支: ${branch}` : ''}`,
    );
  },
  {
    name: 'karin-plugin-git:addRepo',
    priority: 500,
    event: 'message.group',
    permission: 'master',
  },
);
