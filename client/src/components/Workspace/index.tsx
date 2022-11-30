import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useState } from 'react';
import { getWorkspaceInfo } from 'src/apis/workspace';
import { MomContext } from 'src/contexts/mom';
import { TMom } from 'src/types/mom';
import { WorkspaceInfo } from 'src/types/workspace';

interface WorkspaceProps {
  workspaceId?: string;
}

function Workspace({ workspaceId }: WorkspaceProps) {
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [mom, setMom] = useState<TMom | null>(null);

  useEffect(() => {
    loadWorkspaceInfo();
  }, []);

  const loadWorkspaceInfo = async () => {
    if (workspaceId) {
      const workspaceInfo = await getWorkspaceInfo({ id: workspaceId });
      setWorkspace(workspaceInfo);

      // 제일 처음 입장했을 때 defalult 회의록 보여주기
      if (workspaceInfo.moms.length) {
        setMom(workspaceInfo.moms[0]);
      }
    }
  };

  return (
    workspace && (
      <MomContext.Provider value={{ mom, setMom }}>
        <Sidebar workspace={workspace} />
        <Mom />
      </MomContext.Provider>
    )
  );
}

export default Workspace;
