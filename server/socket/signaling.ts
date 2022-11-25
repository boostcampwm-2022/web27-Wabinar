import { Server } from 'socket.io';

function signalingSocketServer(io: Server) {
  const signaling = io.of(/^\/api\/signaling\/\d+$/);

  signaling.on('connection', (socket) => {
    const socketId = socket.id;

    socket.on('join', () => {
      socket.broadcast.emit('join', { socketId });
    });

    // senderId : offer를 보내기 시작한 사람의 id, receiveId : offer를 받는 사람의 id
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

    socket.on('disconnect', () => {
      socket.broadcast.emit('disconnected', socketId);
    });
  });
}

export default signalingSocketServer;
