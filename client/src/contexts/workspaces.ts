import { createContext } from 'react';
import { Workspace } from 'src/types/workspace';

interface IWorkspceContext {
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
}

const WorkspacesContext = createContext<IWorkspceContext | null>(null);

export default WorkspacesContext;
