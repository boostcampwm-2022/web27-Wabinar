import { Workspace } from '@wabinar/types/workspace';
import { createContext } from 'react';

type SetWorkspaces =
  | React.Dispatch<React.SetStateAction<Workspace[]>>
  | (() => void);

const SetWorkspacesContext = createContext<SetWorkspaces>(() => {
  return;
});

export default SetWorkspacesContext;
