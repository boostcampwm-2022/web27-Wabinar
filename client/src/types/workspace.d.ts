import { Mom } from './mom';
import { User } from './user';

export interface Workspace {
  id: number;
  name: string;
  code: string;
}

export type GetUserInfo = {
  user: User;
  workspaces: Workspace[];
};

export type WorkspaceInfo = {
  name: string;
  members: User[];
  moms: Mom[];
};
