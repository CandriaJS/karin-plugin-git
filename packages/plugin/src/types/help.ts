export interface group {
  icon: string;
  title: string;
  desc: string;
}

export interface groupList {
  group: string;
  auth?: Role;
  list: group[];
}
export type Role = 'master' | 'member'
export type HelpListType = groupList[];