import { memo, useEffect, useState } from 'react';
import { getWorkspacesAPI } from 'src/apis/user';
import { Workspace } from 'src/types/workspace';

import AddButton from './AddButton';
import style from './style.module.scss';
import WorkspaceThumbnaliList from './WorkspaceThumbnailList';

interface WorkspaceListProps {
  onSelectModalOpen: () => void;
}

function WorkspaceList({ onSelectModalOpen }: WorkspaceListProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  /**
   * 나중에 login하고 context생기면 바꿔 끼우면 돼요.
   */
  const userId = 63814960;

  const getWorkspaces = async (userId: number) => {
    const { workspaces } = await getWorkspacesAPI(userId);
    setWorkspaces(workspaces);
  };

  useEffect(() => {
    getWorkspaces(userId);
  }, []);

  return (
    <div className={style.workspace__container}>
      <WorkspaceThumbnaliList workspaces={workspaces} />
      <AddButton onClick={onSelectModalOpen} />
    </div>
  );
}

export default memo(WorkspaceList);
