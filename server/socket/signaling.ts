import { Server } from 'socket.io';

function signalingSocketServer(io: Server) {
  const signaling = io.of(/^\/signaling\/\d+$/);
  const users: string[] = [];

  signaling.on('connection', (socket) => {
    socket.on('join', () => {
      const socketId = socket.id;
      console.log(socketId, '들어옴');

      users.push(socketId);

      const otherUser = users.filter((id) => id !== socketId);

      socket.emit('join', otherUser);
    });

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
