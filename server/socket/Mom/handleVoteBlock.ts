import {
  createVote,
  endVote,
  Option,
  getVoteResult,
  updateVote,
} from '@apis/mom/block/vote/service';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { Server, Socket } from 'socket.io';

export default function handleVoteBlock(
  io: Server,
  namespace: string,
  socket: Socket,
) {
  socket.on(BLOCK_EVENT.CREATE_VOTE, async (blockId, options: Option[]) => {
    const momId = socket.data.momId;

    await createVote(blockId, options);

    socket.to(momId).emit(`${BLOCK_EVENT.CREATE_VOTE}-${blockId}`, options);
  });

  socket.on(BLOCK_EVENT.UPDATE_VOTE, async (blockId, optionId, userId) => {
    const momId = socket.data.momId;

    const participantCount = await updateVote(blockId, optionId, userId);

    io.of(namespace)
      .to(momId)
      .emit(`${BLOCK_EVENT.UPDATE_VOTE}-${blockId}`, participantCount);
  });

  socket.on(BLOCK_EVENT.END_VOTE, async (blockId) => {
    const momId = socket.data.momId;

    const vote = await endVote(blockId);

    const voteResult = getVoteResult(vote);

    io.of(namespace)
      .to(momId)
      .emit(`${BLOCK_EVENT.END_VOTE}-${blockId}`, voteResult);
  });
}
