import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useState } from 'react';
import { getWorkspaceInfo } from 'src/apis/workspace';
import { WorkspaceInfo } from 'src/types/workspace';
interface WorkspaceProps {
  workspaceId?: string;
}

function Workspace({ workspaceId }: WorkspaceProps) {
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);

  useEffect(() => {
    loadWorkspaceInfo();
  }, []);

  const loadWorkspaceInfo = async () => {
    if (workspaceId) {
      const workspaceInfo = await getWorkspaceInfo({ id: workspaceId });
      setWorkspace(workspaceInfo);
    }
  };

  return (
    workspace && (
      <>
        <Sidebar workspace={workspace} />
        <Mom />
      </>
    )
  );
}

export default Workspace;
