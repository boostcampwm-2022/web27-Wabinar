import { useContext } from 'react';
import WorkspacesContext from 'src/contexts/workspaces';

export default function useWorkspacesContext() {
  const context = useContext(WorkspacesContext);

  if (!context)
    throw new Error('UserContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
