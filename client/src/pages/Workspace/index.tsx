import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { getWorkspaceInfo } from 'src/apis/workspace';
import ConfBar from 'src/components/ConfBar';
import { RTC } from 'src/constants/socket-message';
import useSocket from 'src/hooks/useSocket';
import { IParticipant } from 'src/types/rtc';
import { WorkspaceInfo } from 'src/types/workspace';

import style from './style.module.scss';

interface IPeerConnection {
  [id: string]: RTCPeerConnection;
}

function WorkspacePage() {
  const { id } = useParams();
  const socket = useSocket(`/signaling/${id}`);

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);

  const loadWorkspaceInfo = async () => {
    if (id) {
      const workspaceInfo = await getWorkspaceInfo({ id });
      setWorkspace(workspaceInfo);
    }
  };

  useEffect(() => {
    loadWorkspaceInfo();
  }, []);

  const peerConnectionConfig = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };

  const myStreamRef = useRef<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const peerConnectionRef = useRef<IPeerConnection | null>(null);

  const setMyStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    myStreamRef.current = stream;

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = myStreamRef.current;
    }
  };

  /* Peer와 연결하기 */
  const setPeerConnection = (socket: Socket, socketId: string) => {
    const peerConnection = new RTCPeerConnection(peerConnectionConfig);

    myStreamRef.current?.getTracks().forEach((track) => {
      if (!myStreamRef.current) return;

      peerConnection.addTrack(track, myStreamRef.current); // 다른 유저에게 전달해주기 위해 내 미디어를 peerConnection 에 추가한다.
    });

    /* 이벤트 핸들러: Peer에게 candidate를 전달 할 필요가 있을때 마다 발생 */
    peerConnection.onicecandidate = (e) => {
      const candidate = e.candidate;
      if (candidate) {
        socket.emit(RTC['ice-candidate'], candidate);
      }
    };

    /* 이벤트 핸들러: peerConnection에 새로운 트랙이 추가됐을 경우 호출됨
      -> 누군가 내 offer를 remoteDescription에 설정했을 때? 
    */
    peerConnection.ontrack = (e) => {
      // 새로운 peer를 참여자에 추가
      setParticipants((participants) => [
        ...participants,
        { socketId, stream: e.streams[0] },
      ]);
    };

    return peerConnection;
  };

  useEffect(() => {
    setMyStream(); // 내 비디오 스트림 설정

    /* 유저 join */
    socket.emit(RTC.join);

    /* 다른 유저 join */
    socket.on(RTC.join, (participants) => {
      participants.forEach(async (participant: IParticipant) => {
        const { socketId } = participant;
        const peerConnection = setPeerConnection(socket, socketId);

        peerConnectionRef.current = {
          ...peerConnectionRef.current,
          [socketId]: peerConnection,
        };

        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);

        socket.emit(RTC.offer, { socketId: participant.socketId, offer });
      });
    });

    /* offer 받기 */
    socket.on(RTC.offer, async ({ socketId, offer }) => {
      const peerConnection = setPeerConnection(socket, socketId);
      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      /* answer 전송 */
      socket.emit(RTC.answer, { answer });
    });

    /* answer 받기 */
    socket.on(RTC.answer, async ({ socketId, answer }) => {
      const peerConnection = peerConnectionRef?.current?.[socketId];
      if (!peerConnection) return;
      peerConnection.setRemoteDescription(answer);
    });

    /* ice candidate */
    socket.on(RTC['ice-candidate'], async ({ socketId, answer }) => {
      const peerConnection = peerConnectionRef?.current?.[socketId];
      if (!peerConnection) return;
      peerConnection.setRemoteDescription(answer);
    });
  }, []);

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
      <ConfBar participants={participants} />
    </div>
  );
}

export default WorkspacePage;
