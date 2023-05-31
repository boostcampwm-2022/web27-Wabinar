import { atom } from 'recoil';
import { WorkspaceInfo } from 'src/types/workspace';

export const workspaceState = atom<WorkspaceInfo | null>({
  key: 'workspace',
  default: null,
});
