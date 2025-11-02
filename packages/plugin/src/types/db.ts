export interface SubscribedRepo {
  id: number;
  botId: string;
  groupId: string;
  owner: string;
  repo: string;
  branch: string;
  commitSha?: string;
  createdAt: Date;
  updatedAt: Date;
}