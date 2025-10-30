import { db } from '@/models';
import karin from 'node-karin';

export const AddRepo = karin.command(
  /^#?git(?:添加|add)订阅仓库([^/\s]+)[/\s]([^/\s]+)$/i,
  async (e) => {
    const [, owner, repo] = e.msg.match(AddRepo!.reg)!;
    let botId = e.selfId;
    let groupId = e.groupId;
    let platform = 'github'
    await db.github.AddRepo(botId, groupId, owner, repo);
    await e.reply(`添加订阅仓库成功, 平台: ${platform}, 仓库: ${owner}/${repo}`)
  },
  {
    name: 'karin-plugin-git:addRepo',
    priority: 500,
    event: 'message.group',
    permission: 'all',
  },
);
