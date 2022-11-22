import { Workspace } from './workspace';

export type TUser = {
  id: number;
  name: string;
  avatarUrl: string;
};

export interface UserInfo {
  user: User;
  workspaces: Workspace[];
}
