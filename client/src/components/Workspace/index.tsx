import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { getWorkspaceInfo } from 'src/apis/workspace';
import MeetingMediaBar from 'src/components/MeetingMediaBar';
import SOCKET_MESSAGE from 'src/constants/socket-message';
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

  const [momSocket, setMomSocket] = useState<Socket | null>(null);
  const [workspaceSocket, setWorkspaceSocket] = useState<Socket | null>(null);

  const loadWorkspaceInfo = async () => {
    if (id) {
      const workspaceInfo = await getWorkspaceInfo({ id });

      setWorkspace(workspaceInfo);

      if (!workspaceInfo.moms[0]) setSelectedMom(null);
    }
  };

  useEffect(() => {
    setMomSocket((prev) => {
      prev?.disconnect();
      return useSocket(`/sc-workspace/${id}`);
    });
    setWorkspaceSocket((prev) => {
      prev?.disconnect();
      return useSocket(`/workspace/${id}`);
    });

    loadWorkspaceInfo();
    setIsOnGoing(false);

    return () => {
      setMomSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setWorkspaceSocket((prev) => {
        prev?.disconnect();
        return null;
      });
    };
  }, [id]);

  useEffect(() => {
    if (!workspaceSocket) {
      return;
    }

    workspaceSocket.on(SOCKET_MESSAGE.WORKSPACE.START_MEETING, () => {
      setIsOnGoing(true);
    });

    workspaceSocket.on(SOCKET_MESSAGE.WORKSPACE.END_MEETING, () => {
      setIsOnGoing(false);
    });

    return () => {
      workspaceSocket.off(SOCKET_MESSAGE.WORKSPACE.START_MEETING);
      workspaceSocket.off(SOCKET_MESSAGE.WORKSPACE.END_MEETING);
    };
  }, [workspaceSocket]);

  return momSocket !== null && workspaceSocket !== null ? (
    <SocketContext.Provider value={{ momSocket, workspaceSocket }}>
      <MeetingContext.Provider value={{ isOnGoing, setIsOnGoing }}>
        {workspace && (
          <SelectedMomContext.Provider value={{ selectedMom, setSelectedMom }}>
            <Sidebar workspace={workspace} />
            <Mom />
          </SelectedMomContext.Provider>
        )}
        {isOnGoing && <MeetingMediaBar />}
      </MeetingContext.Provider>
    </SocketContext.Provider>
  ) : (
    <></>
  );
}

export default Workspace;
