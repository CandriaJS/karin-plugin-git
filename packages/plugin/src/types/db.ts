import type { Platform } from "./index";


export interface RepoInfo {
  id: number;
  botId: string;
  groupId: string;
  owner: string;
  repo: string;
}

export interface PushRepo {
  repoId: number;
  platform: Platform;
  branch: string;
  commitSha: string;
}