import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { getWorkspaceInfo } from 'src/apis/workspace';
import ConfMediaBar from 'src/components/ConfMediaBar';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import ConfContext from 'src/contexts/conf';
import { SelectedMomContext } from 'src/contexts/selected-mom';
import { SocketContext } from 'src/contexts/socket';
import useSocket from 'src/hooks/useSocket';
import { TMom } from 'src/types/mom';
import { WorkspaceInfo } from 'src/types/workspace';

function Workspace() {
  const { id } = useParams();
  const [isStart, setIsStart] = useState(false);

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
    setMomSocket(prev => {
      prev?.disconnect();
      return useSocket(`/sc-workspace/${id}`)
    });
    setWorkspaceSocket(prev => {
      prev?.disconnect();
      return useSocket(`/workspace/${id}`)
    });
    
    loadWorkspaceInfo();
    setIsStart(false);

    return () => {
      setMomSocket(prev => {
        prev?.disconnect();
        return null;
      });
      setWorkspaceSocket(prev => {
        prev?.disconnect();
        return null;
      });
    }
  }, [id]);

  useEffect(() => {
    if (!workspaceSocket) {
      return;
    }

    workspaceSocket.on(SOCKET_MESSAGE.WORKSPACE.START_MEETING, () => {
      setIsStart(true);
    });

    workspaceSocket.on(SOCKET_MESSAGE.WORKSPACE.END_MEETING, () => {
      setIsStart(false);
    });

    return () => {
      workspaceSocket.off(SOCKET_MESSAGE.WORKSPACE.START_MEETING);
      workspaceSocket.off(SOCKET_MESSAGE.WORKSPACE.END_MEETING);
    }
  }, [workspaceSocket]);

  return (
    (momSocket !== null && workspaceSocket !== null) ?
      <SocketContext.Provider value={{ momSocket, workspaceSocket }}>
        <ConfContext.Provider value={{ isStart, setIsStart }}>
          {workspace && (
            <SelectedMomContext.Provider value={{ selectedMom, setSelectedMom }}>
              <Sidebar workspace={workspace} />
              <Mom />
            </SelectedMomContext.Provider>
          )}
          {isStart && <ConfMediaBar />}
        </ConfContext.Provider>
      </SocketContext.Provider>
    : <></>
  );
}

export default Workspace;
