import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { STUN_SERVER } from 'src/constants/rtc';
import RTC from 'src/utils/rtc';
import { setTrack, TrackKind } from 'src/utils/trackSetter';

export function useMeetingMediaStreams(
  socket: Socket,
): [Map<string, MediaStream>, (kind: TrackKind, turnOn: boolean) => void] {
  const [mediaStreams, setMediaStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const [myStream, setMyStream] = useState<MediaStream>();

  const setMyTrack = async (kind: TrackKind, turnOn: boolean) => {
    if (!myStream) {
      return;
    }
    setTrack(myStream, kind, turnOn);
  };

  const initRTC = async () => {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMyStream(userMedia);
    setMediaStreams((prev) =>
      copyMapWithOperation(prev, (map) => map.set('me', userMedia)),
    );

    const rtc = new RTC(socket, STUN_SERVER, userMedia);

    rtc.onMediaConnected((socketId, remoteStream) => {
      setMediaStreams((prev) =>
        copyMapWithOperation(prev, (map) => map.set(socketId, remoteStream)),
      );
    });

    rtc.onMediaDisconnected((socketId) => {
      setMediaStreams((prev) =>
        copyMapWithOperation(prev, (map) => map.delete(socketId)),
      );
    });

    rtc.connect();
  };

  useEffect(() => {
    initRTC();
  }, []);

  return [mediaStreams, setMyTrack];
}

// TODO: 코드 반복때문에 만든 함수. 더 좋은 방법 있으면 고치기
function copyMapWithOperation<K, V>(
  prev: Map<K, V>,
  operation: (cur: Map<K, V>) => void,
) {
  const cur = new Map(prev);
  operation(cur);
  return cur;
}
