import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import ConfBar from 'src/components/ConfBar';
import { STUN_SERVER } from 'src/constants/rtc';
import useSocket from 'src/hooks/useSocket';
import { WorkspaceInfo } from 'src/types/workspace';
import RTC from 'src/utils/rtc';

import style from './style.module.scss';

function WorkspacePage() {
  const { id } = useParams();
  const socket = useSocket(`/signaling/${id}`);
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

  const myStreamRef = useRef<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async function setMedia() {
      const constraints = {
        audio: true,
        video: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      myStreamRef.current = stream;

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = myStreamRef.current;
      }
    })();
  }, []);

  const [participants, setParticipants] = useState<Map<string, MediaStream>>(
    new Map(),
  );

  useEffect(() => {
    if (myStreamRef.current) {
      const rtc = new RTC(socket, STUN_SERVER, myStreamRef.current);

      rtc.onMediaConnected((socketId, remoteStream) => {
        setParticipants((prev) => {
          const newState = new Map(prev);
          newState.set(socketId, remoteStream);
          return newState;
        });
      });

      rtc.onMediaDisconnected((socketId) => {
        setParticipants((prev) => {
          const newState = new Map(prev);
          newState.delete(socketId);
          return newState;
        });
      });

      rtc.connect();
    }
  }, [myStreamRef.current]);
  console.log(participants);

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
