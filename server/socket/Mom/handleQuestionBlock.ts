import { addQuestion } from '@apis/mom/block/question/service';
import { getBlock, putBlock } from '@apis/mom/block/service';
import { BlockType } from '@wabinar/api-types/block';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { Server, Socket } from 'socket.io';

export default function handleQuestionBlock(
  io: Server,
  namespace: string,
  socket: Socket,
) {
  socket.on(BLOCK_EVENT.FETCH_QUESTIONS, async (blockId) => {
    const { questionProperties: questions } = await getBlock(blockId);

    socket.emit(`${BLOCK_EVENT.FETCH_QUESTIONS}-${blockId}`, questions);
  });

  socket.on(BLOCK_EVENT.ADD_QUESTIONS, async (blockId, question) => {
    const momId = socket.data.momId;

    await addQuestion(blockId, question);

    io.of(namespace)
      .to(momId)
      .emit(`${BLOCK_EVENT.ADD_QUESTIONS}-${blockId}`, question);
  });

  socket.on(BLOCK_EVENT.RESOLVE_QUESTIONS, async (blockId, questions) => {
    const momId = socket.data.momId;

    await putBlock(blockId, BlockType.QUESTION, questions);

    io.of(namespace)
      .to(momId)
      .emit(`${BLOCK_EVENT.FETCH_QUESTIONS}-${blockId}`, questions);
  });
}
