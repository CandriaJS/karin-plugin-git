interface SubscribedRepo {
  id: number;
  botId: string;
  groupId: string;
  owner: string;
  repo: string;
  defaultBranch?: string;
  commitSha?: string;
  createdAt: Date;
  updatedAt: Date;
}