import * as Questions from '@apis/mom/questions/service';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { Server, Socket } from 'socket.io';

export default function handleQuestionBlock(
  io: Server,
  namespace: string,
  socket: Socket,
) {
  socket.on(BLOCK_EVENT.FETCH_QUESTIONS, () => {
    const questions = Questions.fetch();

    socket.emit(BLOCK_EVENT.FETCH_QUESTIONS, questions);
  });

  socket.on(BLOCK_EVENT.ADD_QUESTIONS, (question) => {
    const momId = socket.data.momId;
    Questions.add(question);

    io.of(namespace).to(momId).emit(BLOCK_EVENT.ADD_QUESTIONS, question);
  });

  socket.on(BLOCK_EVENT.RESOLVE_QUESTIONS, (id, toggledResolved) => {
    const momId = socket.data.momId;

    Questions.toggleResolved(id, toggledResolved);
    const questions = Questions.fetch();

    io.of(namespace).to(momId).emit(BLOCK_EVENT.FETCH_QUESTIONS, questions);
  });
}
