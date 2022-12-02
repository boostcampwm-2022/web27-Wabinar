import SOCKET_MESSAGE from '@constants/socket-message';
import { Server } from 'socket.io';

function workspaceSocketServer(io: Server) {
  const namespace = io.of(/^\/workspace\/\d+$/);

  namespace.on('connection', (socket) => {
    socket.on(SOCKET_MESSAGE.WORKSPACE.START_MEETING, () => {
      namespace.emit(SOCKET_MESSAGE.WORKSPACE.START_MEETING);
    });

    socket.on(SOCKET_MESSAGE.WORKSPACE.END_MEETING, () => {
      namespace.emit(SOCKET_MESSAGE.WORKSPACE.END_MEETING);
    });

    socket.on(SOCKET_MESSAGE.WORKSPACE.SEND_HELLO, () => {
      const senderId = socket.id;

      socket.broadcast.emit(SOCKET_MESSAGE.WORKSPACE.RECEIVE_HELLO, senderId); // broadcast
    });

    // send_offer: response to 'receive_hello' event
    socket.on(SOCKET_MESSAGE.WORKSPACE.SEND_OFFER, (offer, receiverId) => {
      const senderId = socket.id;

      socket
        .to(receiverId)
        .emit(SOCKET_MESSAGE.WORKSPACE.RECEIVE_OFFER, offer, senderId);
    });

    // send_answer: response to 'receive_offer' event
    socket.on(SOCKET_MESSAGE.WORKSPACE.SEND_ANSWER, (answer, receiverId) => {
      const senderId = socket.id;

      socket
        .to(receiverId)
        .emit(SOCKET_MESSAGE.WORKSPACE.RECEIVE_ANSWER, answer, senderId);
    });

    socket.on(SOCKET_MESSAGE.WORKSPACE.SEND_ICE, (ice, receiverId) => {
      const senderId = socket.id;

      socket
        .to(receiverId)
        .emit(SOCKET_MESSAGE.WORKSPACE.RECEIVE_ICE, ice, senderId);
    });

    socket.on('disconnecting', () => {
      const senderId = socket.id;
      socket.broadcast.emit(SOCKET_MESSAGE.WORKSPACE.RECEIVE_BYE, senderId);
    });
  });
}

export default workspaceSocketServer;
