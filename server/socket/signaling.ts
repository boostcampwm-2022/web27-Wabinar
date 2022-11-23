import { Server } from 'socket.io';

function signalingSocketServer(io: Server) {
  const namspace = io.of('/signaling');
  let time = 0;
  let isStart = false;

  namspace.on('connection', (socket) => {
    socket.on('start-meeting', () => {
      console.log('회의 시작');
      isStart = true;
      setInterval(() => {
        time += 1;
      }, 1000);
    });

    socket.broadcast.emit('set-time', { time, isStart });
  });
}

export default signalingSocketServer;
