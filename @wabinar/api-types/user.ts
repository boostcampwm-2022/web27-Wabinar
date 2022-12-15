import { Workspace } from './workspace';

export type User = {
  id: number;
  name: string;
  avatarUrl: string;
};

export interface GetWorkspaceParams {
  id: number;
}

export interface GetWorkspacesResBody {
  workspaces: Workspace[];
}
