import { createContext } from 'react';
import { Workspace } from 'src/types/workspace';

type SetWorkspaces =
  | React.Dispatch<React.SetStateAction<Workspace[]>>
  | (() => void);

const SetWorkspacesContext = createContext<SetWorkspaces>(() => {
  return;
});

export default SetWorkspacesContext;
