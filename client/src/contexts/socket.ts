import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface ISocketContext {
  momSocket: Socket | null;
  workspaceSocket: Socket | null;
}

export const SocketContext = createContext<ISocketContext | null>(null);
