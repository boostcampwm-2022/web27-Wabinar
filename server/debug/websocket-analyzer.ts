import { Server } from 'socket.io';

export function getSocketsForNamespaces(io: Server) {
  const _nsps = io._nsps;

  const namespaces = Array.from(_nsps.keys());
  const socketsForNamespaces = namespaces.map((namespace) => {
    return { [namespace]: Array.from(_nsps.get(namespace).sockets.keys()) };
  });

  return socketsForNamespaces;
}
