import { io } from 'socket.io-client';
import env from 'src/config';

export default function useSocket(namespace: string) {
  return io(`${env.SERVER_PATH}${namespace}`);
}
