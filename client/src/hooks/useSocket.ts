import env from 'config';
import { io } from 'socket.io-client';

function useSocket(namespace: string) {
  const socket = io(env.SERVER_PATH + namespace);

  return socket;
}

export default useSocket;
