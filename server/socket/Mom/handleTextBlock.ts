import CrdtManager from '@utils/crdt-manager';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { Socket } from 'socket.io';

export default function handleTextBlock(
  socket: Socket,
  crdtManager: CrdtManager,
) {
  socket.on(BLOCK_EVENT.INIT, async (blockId) => {
    const blockCrdt = await crdtManager.getBlockCRDT(blockId);

    socket.emit(BLOCK_EVENT.INIT, blockId, blockCrdt.data);
  });

  socket.on(BLOCK_EVENT.INSERT_TEXT, async (blockId, op) => {
    const momId = socket.data.momId;

    await crdtManager.onInsertText(blockId, op);

    socket.to(momId).emit(BLOCK_EVENT.INSERT_TEXT, blockId, op);
  });

  socket.on(BLOCK_EVENT.DELETE_TEXT, async (blockId, op) => {
    const momId = socket.data.momId;

    await crdtManager.onDeleteText(blockId, op);

    socket.to(momId).emit(BLOCK_EVENT.DELETE_TEXT, blockId, op);
  });

  socket.on(BLOCK_EVENT.UPDATE_TEXT, async (blockId, ops) => {
    const momId = socket.data.momId;

    for await (const op of ops) {
      await crdtManager.onInsertText(blockId, op);
    }

    const blockCrdt = await crdtManager.getBlockCRDT(blockId);

    socket.to(momId).emit(BLOCK_EVENT.UPDATE_TEXT, blockId, blockCrdt.data);
  });
}
