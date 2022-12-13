import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import MeetingMediaBar from 'src/components/MeetingMediaBar';
import MeetingContext from 'src/contexts/meeting';
import { SelectedMomContext } from 'src/contexts/selected-mom';
import { SocketContext } from 'src/contexts/socket';
import useSocket from 'src/hooks/useSocket';
import { TMom } from 'src/types/mom';
import { WorkspaceInfo } from 'src/types/workspace';

function Workspace() {
  const { id } = useParams();
  const [isOnGoing, setIsOnGoing] = useState(false);

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [selectedMom, setSelectedMom] = useState<TMom | null>(null);

  const momSocket = useSocket(`/sc-workspace/${id}`);
  const workspaceSocket = useSocket(`/workspace/${id}`);

  const loadWorkspaceInfo = async () => {
    if (id) {
      const workspaceInfo = await getWorkspaceInfo({ id });

      setWorkspace(workspaceInfo);

      if (!workspaceInfo.moms[0]) setSelectedMom(null);
    }
  };

  useEffect(() => {
    loadWorkspaceInfo();
    setIsOnGoing(false);
  }, [id]);

  useEffect(() => {
    if (!workspaceSocket) {
      return;
    }

    workspaceSocket.on(WORKSPACE_EVENT.START_MEETING, () => {
      setIsOnGoing(true);
    });

    workspaceSocket.on(WORKSPACE_EVENT.END_MEETING, () => {
      setIsOnGoing(false);
    });

    return () => {
      workspaceSocket.off(WORKSPACE_EVENT.START_MEETING);
      workspaceSocket.off(WORKSPACE_EVENT.END_MEETING);
    };
  }, [workspaceSocket]);

  const memoizedSocketValue = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => ({ momSocket: momSocket!, workspaceSocket: workspaceSocket! }),
    [momSocket, workspaceSocket],
  );

  const memoizedOnGoingValue = useMemo(
    () => ({ isOnGoing, setIsOnGoing }),
    [isOnGoing],
  );

  return (
    <SocketContext.Provider value={memoizedSocketValue}>
      <MeetingContext.Provider value={memoizedOnGoingValue}>
        {workspace && (
          <SelectedMomContext.Provider value={{ selectedMom, setSelectedMom }}>
            <Sidebar workspace={workspace} />
            <Mom />
          </SelectedMomContext.Provider>
        )}
        {isOnGoing && <MeetingMediaBar />}
      </MeetingContext.Provider>
    </SocketContext.Provider>
  );
}

export default Workspace;
