import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';
import ConfBar from 'src/components/ConfBar';
import useRTC from 'src/hooks/useRTC';
import { WorkspaceInfo } from 'src/types/workspace';

import style from './style.module.scss';

interface IPeerConnection {
  [id: string]: RTCPeerConnection; // key: 각 클라이언트의 socketId, value: RTCPeerConnection 객체
}

function WorkspacePage() {
  const { id } = useParams();
  // const socket = useSocket(`/signaling/${id}`);
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

  /* WebRTC */
  // const peerConnectionConfig = {
  //   iceServers: [
  //     {
  //       urls: RTC.STUN_SERVER,
  //     },
  //   ],
  // };

  // const myStreamRef = useRef<MediaStream | null>(null);
  // const myVideoRef = useRef<HTMLVideoElement | null>(null);
  // const [participants, setParticipants] = useState<IParticipant[]>([]);
  // const peerConnectionRef = useRef<IPeerConnection | null>(null);

  // /* 내 스트림 설정하기 */
  // const setMyStream = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //   });
  //   myStreamRef.current = stream;

  //   if (myVideoRef.current) {
  //     myVideoRef.current.srcObject = myStreamRef.current;
  //   }
  // };

  // /**
  //  * Peer와 연결하기
  //  * @param peerId 연결할 피어의 Id
  //  * @returns 새로 생성한 peerConnection 객체
  //  */
  // const setPeerConnection = (peerId: string) => {
  //   const peerConnection = new RTCPeerConnection(peerConnectionConfig);

  //   myStreamRef.current?.getTracks().forEach((track) => {
  //     if (!myStreamRef.current) return;

  //     // 다른 유저에게 전달해주기 위해 내 미디어를 peerConnection 에 추가한다.
  //     // track이 myStreamRef.current(내 스트림)에 추가됨
  //     peerConnection.addTrack(track, myStreamRef.current);
  //   });

  //   /* 이벤트 핸들러: Peer에게 candidate를 전달 할 필요가 있을때 마다 발생 */
  //   peerConnection.onicecandidate = (e) => {
  //     const candidate = e.candidate;
  //     console.log('candidate', candidate);
  //     if (candidate) {
  //       socket.emit(RTC_MESSAGE.ICE_CANDIDATE, {
  //         receiveId: peerId,
  //         candidate,
  //       });
  //     }
  //   };

  //   /* 이벤트 핸들러: peerConnection에 새로운 트랙이 추가됐을 경우 호출됨
  //     -> 누군가 내 offer를 remoteDescription에 설정했을 때?
  //     -> 아니면 내가 누군가의 offer를 remoteDescription에 추가했을 때?
  //   */
  //   peerConnection.ontrack = (e) => {
  //     console.log('ontrack', e.streams[0]);
  //     // 새로운 peer를 참여자에 추가
  //     setParticipants((participants) => [
  //       ...participants,
  //       { socketId: peerId, stream: e.streams[0] },
  //     ]);
  //   };

  //   return peerConnection;
  // };

  // useEffect(() => {
  //   if (!socket) return;

  //   setMyStream();

  //   /* 유저 join */
  //   socket.emit(RTC_MESSAGE.JOIN);

  //   /* 다른 유저 join */
  //   socket.on(RTC_MESSAGE.JOIN, ({ participants }) => {
  //     console.log('다른 유저 join', participants);

  //     participants.forEach(async (participant: IParticipant) => {
  //       const { socketId } = participant;
  //       const peerConnection = setPeerConnection(socketId);

  //       peerConnectionRef.current = {
  //         ...peerConnectionRef.current,
  //         [socketId]: peerConnection,
  //       };

  //       const offer = await peerConnection.createOffer();
  //       peerConnection.setLocalDescription(offer);

  //       socket.emit(RTC_MESSAGE.OFFER, {
  //         receiveId: participant.socketId,
  //         offer,
  //       });
  //     });
  //   });

  //   /* offer 받기 */
  //   socket.on(RTC_MESSAGE.OFFER, async ({ senderId, offer }) => {
  //     console.log('offer 받기', { senderId, offer });

  //     const peerConnection = setPeerConnection(senderId);
  //     await peerConnection.setRemoteDescription(offer);

  //     const answer = await peerConnection.createAnswer();
  //     await peerConnection.setLocalDescription(answer);

  //     /* answer 전송 */
  //     socket.emit(RTC_MESSAGE.ANSWER, { receiveId: senderId, answer });
  //   });

  //   /* answer 받기 */
  //   socket.on(RTC_MESSAGE.ANSWER, async ({ senderId, answer }) => {
  //     console.log('answer 받기', { senderId, answer });

  //     const peerConnection = peerConnectionRef?.current?.[senderId];
  //     if (!peerConnection) return;
  //     peerConnection.setRemoteDescription(answer);
  //   });

  //   /* ice candidate */
  //   socket.on(RTC_MESSAGE.ICE_CANDIDATE, async ({ senderId, candidate }) => {
  //     console.log('ice candidate', { senderId, candidate });

  //     const peerConnection = peerConnectionRef?.current?.[senderId];
  //     if (!peerConnection) return;
  //     await peerConnection.addIceCandidate(candidate);
  //   });
  // }, []);

  const participants = useRTC({ signalingNamespace: `/signaling/${id}` });

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
