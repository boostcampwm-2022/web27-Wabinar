import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface ISocketContext {
  momSocket: Socket;
  signalingSocket: Socket;
}

export const SocketContext = createContext<ISocketContext | null>(null);
