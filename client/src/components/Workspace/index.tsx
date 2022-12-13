import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import MeetingMediaBar from 'src/components/MeetingMediaBar';
import { MeetingMode } from 'src/constants/rtc';
import MeetingContext from 'src/contexts/meeting';
import { SelectedMomContext } from 'src/contexts/selected-mom';
import { SocketContext } from 'src/contexts/socket';
import useSocket from 'src/hooks/useSocket';
import { TMom } from 'src/types/mom';
import { WorkspaceInfo } from 'src/types/workspace';

import MediaPermissionModal from '../MediaPermissionModal';

function Workspace() {
  const { id } = useParams();
  const [meetingMode, setMeetingMode] = useState(MeetingMode.NOT_GOING);

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
  }, [id]);

  useEffect(() => {
    if (!workspaceSocket) {
      return;
    }

    workspaceSocket.on(WORKSPACE_EVENT.START_MEETING, () => {
      setMeetingMode(MeetingMode.READY);
    });

    workspaceSocket.on(WORKSPACE_EVENT.END_MEETING, () => {
      setMeetingMode(MeetingMode.NOT_GOING);
    });

    return () => {
      workspaceSocket.off(WORKSPACE_EVENT.START_MEETING);
      workspaceSocket.off(WORKSPACE_EVENT.END_MEETING);
    };
  }, [workspaceSocket]);

  if (!momSocket || !workspaceSocket) return <></>;

  return (
    <SocketContext.Provider value={{ momSocket, workspaceSocket }}>
      <MeetingContext.Provider value={{ meetingMode, setMeetingMode }}>
        {workspace && (
          <SelectedMomContext.Provider value={{ selectedMom, setSelectedMom }}>
            <Sidebar workspace={workspace} />
            <Mom />
          </SelectedMomContext.Provider>
        )}
        {meetingMode === MeetingMode.READY && <MediaPermissionModal />}
        {meetingMode === MeetingMode.GOING && <MeetingMediaBar />}
      </MeetingContext.Provider>
    </SocketContext.Provider>
  );
}

export default Workspace;
