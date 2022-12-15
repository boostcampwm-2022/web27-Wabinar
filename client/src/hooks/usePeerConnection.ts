import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import { useEffect, useRef } from 'react';

import { User } from './../types/user.d';
import useMyMediaStreamContext from './context/useMyMediaStreamContext';
import useSocketContext from './context/useSocketContext';
import useUserStreamContext from './context/useUserStreamsContext';

const usePeerConnection = () => {
  const { myMediaStream } = useMyMediaStreamContext();
  const { userStreams, setUserStreams, setConnectedUsers } =
    useUserStreamContext();
  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const { workspaceSocket } = useSocketContext();

  useEffect(() => {
    const createPeerConnection = (sid: string) => {
      try {
        const RTCConfig = {
          iceServers: [
            {
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
              ],
            },
          ],
        };

        const peerConnection = new RTCPeerConnection(RTCConfig);

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            workspaceSocket.emit(
              WORKSPACE_EVENT.SEND_ICE,
              event.candidate,
              sid,
            );
          }
        };

        peerConnection.ontrack = (event: RTCTrackEvent) => {
          const stream = event.streams[0];

          setUserStreams((prev) => ({ ...prev, [sid]: stream }));
        };

        myMediaStream?.getTracks().forEach((track) => {
          peerConnection.addTrack(track, myMediaStream);
        });

        peerConnection.onnegotiationneeded = async () => {
          try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            workspaceSocket.emit(WORKSPACE_EVENT.SEND_OFFER, offer, sid);
          } catch (err) {
            console.error(err);
          }
        };

        return peerConnection;
      } catch (err) {
        console.debug(err);
      }
    };

    const onReceivedOffer = async (
      offer: RTCSessionDescriptionInit,
      sid: string,
    ) => {
      const pc = createPeerConnection(sid);
      if (!pc) return;

      pcsRef.current = { ...pcsRef.current, [sid]: pc };

      try {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        workspaceSocket.emit(WORKSPACE_EVENT.SEND_ANSWER, answer, sid);
      } catch (err) {
        console.debug(err);
      }
    };

    const onReceivedAnswer = async (
      answer: RTCSessionDescriptionInit,
      sid: string,
    ) => {
      const pc = pcsRef.current?.[sid];

      if (!pc) return;
      await pc.setRemoteDescription(answer);
    };

    const onReceivedIceCandidate = async (
      iceCandidate: RTCIceCandidateInit,
      sid: string,
    ) => {
      const pc = pcsRef.current?.[sid];

      if (!pc) return;
      await pc.addIceCandidate(iceCandidate);
    };

    const onReceivedUser = async (sid: string, user: User) => {
      const pc = createPeerConnection(sid);

      if (!pc) return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      pcsRef.current = { ...pcsRef.current, [sid]: pc };

      setConnectedUsers((prev) => [
        ...prev,
        {
          sid: sid,
          uid: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      ]);

      workspaceSocket.emit(WORKSPACE_EVENT.SEND_OFFER, offer, sid);
    };

    workspaceSocket.on(WORKSPACE_EVENT.RECEIVE_HELLO, onReceivedUser);
    workspaceSocket.on(WORKSPACE_EVENT.RECEIVE_OFFER, onReceivedOffer);
    workspaceSocket.on(WORKSPACE_EVENT.RECEIVE_ANSWER, onReceivedAnswer);
    workspaceSocket.on(WORKSPACE_EVENT.RECEIVE_ICE, onReceivedIceCandidate);

    return () => {
      workspaceSocket.off(WORKSPACE_EVENT.RECEIVE_OFFER);
      workspaceSocket.off(WORKSPACE_EVENT.RECEIVE_ANSWER);
      workspaceSocket.off(WORKSPACE_EVENT.RECEIVE_ICE);

      if (userStreams) {
        Object.keys(userStreams).forEach((sid) => {
          pcsRef.current?.[sid].close();
          delete pcsRef.current[sid];
        });
      }
    };
  }, [userStreams, myMediaStream]);
};

export default usePeerConnection;
