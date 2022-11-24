import { Server } from 'socket.io';

function signalingSocketServer(io: Server) {
  const signaling = io.of(/^\/signaling\/\d+$/);

  signaling.on('connection', (socket) => {
    socket.on('send_hello', () => {
      const senderId = socket.id;

      socket.broadcast.emit('receive_hello', senderId); // broadcast
    });

    // send_offer: response to 'receive_hello' event
    socket.on('send_offer', (offer, receiverId) => {
      const senderId = socket.id;

      socket.to(receiverId).emit('receive_offer', offer, senderId);
    });

    // send_answer: response to 'receive_offer' event
    socket.on('send_answer', (answer, receiverId) => {
      const senderId = socket.id;

      socket.to(receiverId).emit('receive_answer', answer, senderId);
    });

    socket.on('send_ice', (ice, receiverId) => {
      const senderId = socket.id;

      socket.to(receiverId).emit('receive_ice', ice, senderId);
    });

    socket.on('disconnecting', () => {
      const senderId = socket.id;
      socket.broadcast.emit('receive_bye', senderId);
    });
  });
}

export default signalingSocketServer;
