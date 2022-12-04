import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useState } from 'react';
import { getWorkspaceInfo } from 'src/apis/workspace';
import { SelectedMomContext } from 'src/contexts/selected-mom';
import { TMom } from 'src/types/mom';
import { WorkspaceInfo } from 'src/types/workspace';

interface WorkspaceProps {
  workspaceId?: string;
}

function Workspace({ workspaceId }: WorkspaceProps) {
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [selectedMom, setSelectedMom] = useState<TMom | null>(null);

  useEffect(() => {
    loadWorkspaceInfo();
  }, [workspaceId]);

  const loadWorkspaceInfo = async () => {
    if (workspaceId) {
      const workspaceInfo = await getWorkspaceInfo({ id: workspaceId });

      setWorkspace(workspaceInfo);

      if (!workspaceInfo.moms[0]) setSelectedMom(null);
    }
  };

  return (
    workspace && (
      <SelectedMomContext.Provider value={{ selectedMom, setSelectedMom }}>
        <Sidebar workspace={workspace} />
        <Mom />
      </SelectedMomContext.Provider>
    )
  );
}

export default Workspace;
