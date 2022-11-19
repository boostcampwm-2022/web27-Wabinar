import { useContext } from 'react';
import SetWorkspacesContext from 'src/contexts/set-workspaces';

export function useSetWorkspaces() {
  const context = useContext(SetWorkspacesContext);

  if (!context)
    throw new Error('UserContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
