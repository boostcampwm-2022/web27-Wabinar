import { createContext } from 'react';
import { Workspace } from 'src/types/workspace';

interface IWorkspceContext {
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
}

const WorkspaceContext = createContext<IWorkspceContext | null>(null);

export default WorkspaceContext;
