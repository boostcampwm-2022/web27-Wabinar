import { Server } from 'socket.io';

function signalingSocketServer(io: Server) {
  const signaling = io.of(/^\/signaling\/\d+$/);

  signaling.on('connection', (socket) => {
    const name = socket.nsp.name;
    const workspaceId = name.match(/\d+/g)[0];

    if (!workspaceId) {
      socket.disconnect();
      return;
    }

    socket.join(workspaceId);

    socket.on('offer', (sdp, roomId) => {
      socket.to(roomId).emit('offer', sdp);
    });

    socket.on('answer', (sdp, roomId) => {
      socket.to(roomId).emit('answer', sdp);
    });

    socket.on('candidate', (candidate, roomId) => {
      socket.to(roomId).emit('candidate', candidate);
    });
  });
}

export default signalingSocketServer;
