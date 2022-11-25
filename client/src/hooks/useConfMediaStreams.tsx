import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import RTC from 'src/utils/rtc';

export function useConfMediaStreams() {
  const [mediaStreams, setMediaStreams] = useState<Map<string, MediaStream>>(new Map());

  useEffect(() => {
    (async () => {
      const userMedia = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      setMediaStreams(prev => copyMapWithOperation(prev, map => map.set('me', userMedia)));

      const socket = io('http://localhost:8080/123'); // TODO: 임시 시그널링 주소
      const stunServers = [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302'
      ];
      const rtc = new RTC(socket, stunServers, userMedia);
      rtc.onMediaConnected((socketId, remoteStream) => {
        setMediaStreams(prev => copyMapWithOperation(prev, map => map.set(socketId, remoteStream)));
      });
      rtc.onMediaDisconnected((socketId) => {
        setMediaStreams(prev => copyMapWithOperation(prev, map => map.delete(socketId)));
      });
      rtc.connect();
  })();
  }, [])

  return mediaStreams;
}

function copyMapWithOperation<K, V>(prev: Map<K, V>, operation: (cur: Map<K, V>) => void) {
  const cur = new Map(prev);
  operation(cur);
  return cur;
}