import { Workspace } from './workspace';

export interface GetWorkspaceParams {
  id: number;
}

export interface GetWorkspacesResBody {
  workspaces: Workspace[];
}
