import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { STUN_SERVER } from 'src/constants/rtc';
import RTC from 'src/utils/rtc';
import { setTrack } from 'src/utils/trackSetter';

export interface MeetingMediaStream {
  stream: MediaStream;
  id: string;
  type: 'local' | 'remote';
  audioOn: boolean;
  videoOn: boolean;
}

export type SetLocalAudio = (audioOn: boolean) => void;
export type SetLocalVideo = (videoOn: boolean) => void;

export function useMeetingMediaStreams(
  socket: Socket,
): [MeetingMediaStream[], SetLocalAudio, SetLocalVideo] {
  const [meetingMediaStreams, setMeetingMediaStreams] = useState<
    MeetingMediaStream[]
  >([]);
  const [localStream, setLocalStream] = useState<MediaStream>();

  const initRTC = async () => {
    const userMediaConstraints = { video: true, audio: true };
    const userStream = await navigator.mediaDevices.getUserMedia(
      userMediaConstraints,
    );
    setLocalStream(userStream);

    // note: local MeetingMediaStream has empty id
    const localMeetingMediaStream: MeetingMediaStream = {
      stream: userStream,
      id: '',
      type: 'local',
      audioOn: true,
      videoOn: true,
    };
    setMeetingMediaStreams((prev) => [...prev, localMeetingMediaStream]);

    const rtc = new RTC(socket, STUN_SERVER, userStream);
    rtc.onMediaConnected((socketId, remoteStream) => {
      const remoteMeetingMediaStream: MeetingMediaStream = {
        stream: remoteStream,
        id: socketId,
        type: 'remote',
        audioOn: true,
        videoOn: true,
      };
      setMeetingMediaStreams((prev) => [...prev, remoteMeetingMediaStream]);
    });

    rtc.onMediaDisconnected((socketId) => {
      setMeetingMediaStreams((prev) => prev.filter((_) => _.id !== socketId));
    });

    rtc.connect();
  };

  useEffect(() => {
    initRTC();
  }, []);

  const setLocalAudio: SetLocalAudio = async (audioOn) => {
    if (!localStream) {
      return;
    }
    setTrack(localStream, 'audio', audioOn);
    socket.emit('audio_state_changed', audioOn);
  };

  const setLocalVideo: SetLocalVideo = async (videoOn) => {
    if (!localStream) {
      return;
    }
    setTrack(localStream, 'video', videoOn);
    socket.emit('video_state_changed', videoOn);
  };

  socket.on('audio_state_changed', (socketId, audioOn) => {
    setMeetingMediaStreams((prev) =>
      prev.map((_) => (_.id === socketId ? { ..._, audioOn } : _)),
    );
  });

  socket.on('video_state_changed', (socketId, videoOn) => {
    setMeetingMediaStreams((prev) =>
      prev.map((_) => (_.id === socketId ? { ..._, videoOn } : _)),
    );
  });

  return [meetingMediaStreams, setLocalAudio, setLocalVideo];
}
