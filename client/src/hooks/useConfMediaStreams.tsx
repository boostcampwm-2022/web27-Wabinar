import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { STUN_SERVER } from 'src/constants/rtc';
import RTC from 'src/utils/rtc';

export function useConfMediaStreams(socket: Socket) {
  const [mediaStreams, setMediaStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );

  const initRTC = async () => {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
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

  return mediaStreams;
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
