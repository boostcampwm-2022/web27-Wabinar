import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import ConfBar from 'src/components/ConfBar';
import useRTC from 'src/hooks/useRTC';
import useSocket from 'src/hooks/useSocket';
import { WorkspaceInfo } from 'src/types/workspace';

import style from './style.module.scss';

function WorkspacePage() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);

  /* 워크스페이스 정보 불러오기 */
  const loadWorkspaceInfo = async () => {
    if (id) {
      const workspaceInfo = await getWorkspaceInfo({ id });
      setWorkspace(workspaceInfo);
    }
  };

  useEffect(() => {
    loadWorkspaceInfo();
  }, []);

  const socket = useSocket(`/signaling/${id}`);
  const participants = useRTC({ socket });
  const streams = Array.from(participants.values());

  return (
    <div className={style.container}>
      <WorkspaceList />
      {workspace && (
        <Workspace
          name={workspace.name}
          members={workspace.members}
          moms={workspace.moms}
        />
      )}
      <ConfBar streams={streams} />
    </div>
  );
}

export default WorkspacePage;
