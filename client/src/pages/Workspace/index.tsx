import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import ConfMediaBar from 'src/components/ConfMediaBar';
import { useConfMediaStreams } from 'src/hooks/useConfMediaStreams';
import { WorkspaceInfo } from 'src/types/workspace';

import style from './style.module.scss';

function WorkspacePage() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const confMediaStreams = useConfMediaStreams();

  const loadWorkspaceInfo = async () => {
    if (id) {
      const workspaceInfo = await getWorkspaceInfo({ id });
      setWorkspace(workspaceInfo);
    }
  };

  useEffect(() => {
    loadWorkspaceInfo();
  }, []);

  return (
    <div className={style.container}>
      <WorkspaceList />
      {workspace && ( // TODO: 임시로 만들었어요
        <Workspace
          name={workspace.name}
          members={workspace.members}
          moms={workspace.moms}
        />
      )}
      <ConfMediaBar streams={confMediaStreams} />
    </div>
  );
}

export default WorkspacePage;
