import { RTC } from 'src/constants/rtc';

export const peerConnectionConfig = {
  iceServers: [
    {
      urls: RTC.STUN_SERVER,
    },
  ],
};
