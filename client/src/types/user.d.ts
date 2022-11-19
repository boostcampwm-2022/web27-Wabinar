import { Workspace } from './workspace';

export type User = {
  id: number;
  name: string;
  avatarUrl: string;
};

export interface UserInfo {
  user: User;
  workspaceList: Workspace[];
}
