import { STUN_SERVER } from 'src/constants/rtc';

export const peerConnectionConfig = {
  iceServers: [
    {
      urls: STUN_SERVER,
    },
  ],
};
