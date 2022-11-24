import { Server } from 'socket.io';

interface User {
  socketId: string;
}

function signalingSocketServer(io: Server) {
  const signaling = io.of(/^\/signaling\/\d+$/);
  const users: Set<User> = new Set();

  signaling.on('connection', (socket) => {
    socket.on('join', () => {
      const socketId = socket.id;
      console.log(socketId, '들어옴');

      users.add({ socketId });

      const otherUser = [...users].filter((user) => user.socketId !== socketId);

      socket.emit('join', { socketId, participants: otherUser });
    });

    // senderId : offer를 보내기 시작한 사람의 id
    // receiveId : offer를 받는 사람의 id
    socket.on('offer', ({ receiveId, offer }) => {
      console.log('offer', { receiveId, offer });
      socket.to(receiveId).emit('offer', { senderId: socket.id, offer });
    });

    socket.on('answer', ({ receiveId, answer }) => {
      console.log('answer', { receiveId, answer });
      socket.to(receiveId).emit('answer', { senderId: socket.id, answer });
    });

    socket.on('ice-candidate', ({ receiveId, candidate }) => {
      console.log('ice-candidate', { receiveId, candidate });
      socket
        .to(receiveId)
        .emit('ice-candidate', { senderId: socket.id, candidate });
    });
  });
}

export default signalingSocketServer;
