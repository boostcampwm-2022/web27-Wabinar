import * as Vote from '@apis/mom/vote/service';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { Server, Socket } from 'socket.io';

export default function handleVoteBlock(
  io: Server,
  namespace: string,
  socket: Socket,
) {
  socket.on(BLOCK_EVENT.CREATE_VOTE, (options: Vote.Option[]) => {
    const momId = socket.data.momId;
    const newVote = Vote.createVote(momId, options);

    socket.to(momId).emit(BLOCK_EVENT.CREATE_VOTE, newVote);
  });

  socket.on(BLOCK_EVENT.UPDATE_VOTE, (optionId, userId) => {
    const momId = socket.data.momId;
    const participantCount = Vote.updateVote(momId, Number(optionId), userId);

    io.of(namespace).to(momId).emit(BLOCK_EVENT.UPDATE_VOTE, participantCount);
  });

  socket.on(BLOCK_EVENT.END_VOTE, () => {
    const momId = socket.data.momId;
    const res = Vote.endVote(momId);
    io.of(namespace).to(momId).emit(BLOCK_EVENT.END_VOTE, res);
  });
}
