import { memo, useContext, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import UserContext from 'src/contexts/user';
import { Workspace } from 'src/types/workspace';

import AddButton from './AddButton';
import style from './style.module.scss';
import WorkspaceThumbnaliList from './WorkspaceThumbnailList';

interface WorkspaceListProps {
  onSelectModalOpen: () => void;
}

function WorkspaceList({ onSelectModalOpen }: WorkspaceListProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const userContext = useContext(UserContext);

  const updateWorkspaces = async (userId: number) => {
    const { workspaces } = await getWorkspaces(userId);
    setWorkspaces(workspaces);
  };

  useEffect(() => {
    if (!userContext) {
      return;
    }
    updateWorkspaces(userContext.user.id);
  }, []);

  return (
    <div className={style.workspace__container}>
      <WorkspaceThumbnaliList workspaces={workspaces} />
      <AddButton onClick={onSelectModalOpen} />
    </div>
  );
}

export default memo(WorkspaceList);
