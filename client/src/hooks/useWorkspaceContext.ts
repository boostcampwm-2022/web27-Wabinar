import { useContext } from 'react';
import WorkspaceContext from 'src/contexts/workspaces';

export default function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);

  if (!context)
    throw new Error('UserContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
