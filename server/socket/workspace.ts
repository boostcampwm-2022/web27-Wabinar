import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import { Server } from 'socket.io';

function workspaceSocketServer(io: Server) {
  const namespace = io.of(/^\/workspace\/\d+$/);

  namespace.on('connection', (socket) => {
    socket.on(WORKSPACE_EVENT.START_MEETING, () => {
      namespace.emit(WORKSPACE_EVENT.START_MEETING);
    });

    socket.on(WORKSPACE_EVENT.END_MEETING, () => {
      namespace.emit(WORKSPACE_EVENT.END_MEETING);
    });

    socket.on(WORKSPACE_EVENT.SEND_HELLO, () => {
      const senderId = socket.id;

      socket.broadcast.emit(WORKSPACE_EVENT.RECEIVE_HELLO, senderId); // broadcast
    });

    // send_offer: response to 'receive_hello' event
    socket.on(WORKSPACE_EVENT.SEND_OFFER, (offer, receiverId) => {
      const senderId = socket.id;

      socket
        .to(receiverId)
        .emit(WORKSPACE_EVENT.RECEIVE_OFFER, offer, senderId);
    });

    // send_answer: response to 'receive_offer' event
    socket.on(WORKSPACE_EVENT.SEND_ANSWER, (answer, receiverId) => {
      const senderId = socket.id;

      socket
        .to(receiverId)
        .emit(WORKSPACE_EVENT.RECEIVE_ANSWER, answer, senderId);
    });

    socket.on(WORKSPACE_EVENT.SEND_ICE, (ice, receiverId) => {
      const senderId = socket.id;

      socket.to(receiverId).emit(WORKSPACE_EVENT.RECEIVE_ICE, ice, senderId);
    });

    // TODO: 소켓 이벤트 메시지 상수화
    socket.on('audio_state_changed', (audioOn) => {
      namespace.emit('audio_state_changed', socket.id, audioOn);
    });

    socket.on('video_state_changed', (videoOn) => {
      namespace.emit('video_state_changed', socket.id, videoOn);
    });

    socket.on('bye', () => {
      const senderId = socket.id;
      socket.broadcast.emit(WORKSPACE_EVENT.RECEIVE_BYE, senderId);
    });

    socket.on('disconnecting', () => {
      const senderId = socket.id;
      socket.broadcast.emit(WORKSPACE_EVENT.RECEIVE_BYE, senderId);
    });
  });
}

export default workspaceSocketServer;
