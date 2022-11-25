import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { peerConnectionConfig } from 'src/config/rtc';
import { RTC_MESSAGE } from 'src/constants/socket-message';

interface IPeerConnection {
  [id: string]: RTCPeerConnection; // key: 각 클라이언트의 socketId, value: RTCPeerConnection 객체
}

interface RTCProps {
  socket: Socket;
}

function useRTC({ socket }: RTCProps): Map<string, MediaStream> {
  const myStreamRef = useRef<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const [participants, setParticipants] = useState<Map<string, MediaStream>>(
    new Map(),
  );
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

  /**
   * Peer와 연결하기
   * @param peerId 연결할 피어의 Id
   * @returns 새로 생성한 peerConnection 객체
   */
  const setPeerConnection = (peerId: string) => {
    const peerConnection = new RTCPeerConnection(peerConnectionConfig);

    myStreamRef.current?.getTracks().forEach((track) => {
      if (!myStreamRef.current) return;

      // 다른 유저에게 전달해주기 위해 내 미디어를 peerConnection 에 추가한다.
      // track이 myStreamRef.current(내 스트림)에 추가됨
      peerConnection.addTrack(track, myStreamRef.current);
    });

    /* 이벤트 핸들러: Peer에게 candidate를 전달 할 필요가 있을때 마다 발생 */
    peerConnection.onicecandidate = (e) => {
      const candidate = e.candidate;

      if (candidate) {
        socket.emit(RTC_MESSAGE.ICE_CANDIDATE, {
          receiveId: peerId,
          candidate,
        });
      }
    };

    /* 이벤트 핸들러: peerConnection에 새로운 트랙이 추가됐을 경우 호출됨
      -> 누군가 내 offer를 remoteDescription에 설정했을 때?
      -> 아니면 내가 누군가의 offer를 remoteDescription에 추가했을 때?
    */
    peerConnection.ontrack = (e) => {
      // 새로운 peer를 참여자에 추가
      setParticipants((prev) => {
        const newState = new Map(prev);
        newState.set(peerId, e.streams[0]);
        return newState;
      });
    };

    return peerConnection;
  };

  useEffect(() => {
    if (!socket) return;

    setMyStream();

    /* 유저 join */
    socket.emit(RTC_MESSAGE.JOIN);

    /* 새로 들어온 유저의 socketId를 받음 */
    socket.on(RTC_MESSAGE.JOIN, async ({ socketId }) => {
      const peerConnection = setPeerConnection(socketId);

      peerConnectionRef.current = {
        ...peerConnectionRef.current,
        [socketId]: peerConnection,
      };

      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      socket.emit(RTC_MESSAGE.OFFER, {
        receiveId: socketId,
        offer,
      });
    });

    /* offer 받기 */
    socket.on(RTC_MESSAGE.OFFER, async ({ senderId, offer }) => {
      const peerConnection = setPeerConnection(senderId);
      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      /* answer 전송 */
      socket.emit(RTC_MESSAGE.ANSWER, { receiveId: senderId, answer });
    });

    /* answer 받기 */
    socket.on(RTC_MESSAGE.ANSWER, async ({ senderId, answer }) => {
      const peerConnection = peerConnectionRef?.current?.[senderId];
      if (!peerConnection) return;
      peerConnection.setRemoteDescription(answer);
    });

    /* ice candidate */
    socket.on(RTC_MESSAGE.ICE_CANDIDATE, async ({ senderId, candidate }) => {
      const peerConnection = peerConnectionRef?.current?.[senderId];
      if (!peerConnection) return;
      await peerConnection.addIceCandidate(candidate);
    });

    /* disconnected */
    socket.on(RTC_MESSAGE.DISCONNECTED, async (senderId) => {
      delete peerConnectionRef?.current?.[senderId];
      setParticipants((prev) => {
        const newState = new Map(prev);
        newState.delete(senderId);
        return newState;
      });
    });

    return () => {
      socket.off(RTC_MESSAGE.JOIN);
      socket.off(RTC_MESSAGE.OFFER);
      socket.off(RTC_MESSAGE.ANSWER);
      socket.off(RTC_MESSAGE.ICE_CANDIDATE);
      socket.off(RTC_MESSAGE.DISCONNECTED);
    };
  }, []);

  return participants;
}

export default useRTC;
