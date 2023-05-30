import * as MomMessage from '@wabinar/api-types/mom';
import { MOM_EVENT, WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import MeetingMediaBar from 'src/components/MeetingMediaBar';
import ee from 'src/components/Mom/EventEmitter';
import MeetingContext from 'src/contexts/meeting';
import { SelectedMomContext } from 'src/contexts/selected-mom';
import { SocketContext } from 'src/contexts/socket';
import useSocket from 'src/hooks/useSocket';
import { TMom } from 'src/types/mom';
import { WorkspaceInfo } from 'src/types/workspace';

function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [selectedMom, setSelectedMom] = useState<TMom | null>(null);
  const [isOnGoing, setIsOnGoing] = useState(false);

  const momSocket = useSocket(`/workspace-mom/${id}`);
  const workspaceSocket = useSocket(`/workspace/${id}`);

  const loadWorkspaceInfo = async () => {
    if (id) {
      const workspaceInfo = await getWorkspaceInfo({ id });

      setWorkspace(workspaceInfo);

      if (!workspaceInfo.moms.length) {
        setSelectedMom(null);
      }
    }
  };

  useEffect(() => {
    loadWorkspaceInfo();
    setIsOnGoing(false);
  }, [id]);

  useEffect(() => {
    if (!momSocket) return;

    momSocket.on(MOM_EVENT.SELECT, ({ mom }: MomMessage.Selected) => {
      setSelectedMom(mom);
    });

    return () => {
      momSocket.off(MOM_EVENT.SELECT);
    };
  }, [momSocket]);

  useEffect(() => {
    if (!workspace || !momSocket) return;

    const { moms } = workspace;

    if (moms.length && !getCurrentMom(pathname)) {
      navigate(moms[0]._id);
    }

    ee.on(MOM_EVENT.REQUEST_LOADED, () => {
      ee.emit(MOM_EVENT.LOADED, moms ? moms.length : 0);
    });

    return () => {
      ee.off(MOM_EVENT.REQUEST_LOADED);
    };
  }, [workspace?.moms, momSocket]);

  useEffect(() => {
    const momId = getCurrentMom(pathname);
    if (!momSocket || !momId) return;

    const message: MomMessage.Select = { id: momId };
    momSocket.emit(MOM_EVENT.SELECT, message);
  }, [pathname, momSocket]);

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

const getCurrentMom = (pathname: string) => {
  return pathname.match(/\/workspace\/\d+\/(?<momId>.+)/)?.groups?.momId;
};
