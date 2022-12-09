import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import WorkspacesContext from 'src/contexts/workspaces';

export default function useWorkspacesContext() {
  const context = useContext(WorkspacesContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
