import { Workspace } from './workspace';

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
}
export interface GetWorkspaceParams {
  id: number;
}
export interface GetWorkspaceResBody {
  workspaces: Workspace[];
}
