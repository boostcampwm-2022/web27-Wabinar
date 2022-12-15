import CrdtManager from '@utils/crdt-manager';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { Socket } from 'socket.io';
import * as BlockMessage from '@wabinar/api-types/block';

export default function handleTextBlock(
  socket: Socket,
  crdtManager: CrdtManager,
) {
  socket.on(
    BLOCK_EVENT.INIT_TEXT,
    async ({ id: blockId }: BlockMessage.InitText) => {
      const blockCrdt = await crdtManager.getBlockCRDT(blockId);

      const message: BlockMessage.InitializedText = {
        id: blockId,
        crdt: blockCrdt.data,
      };
      socket.emit(BLOCK_EVENT.INIT_TEXT, message);
    },
  );

  socket.on(
    BLOCK_EVENT.INSERT_TEXT,
    async ({ id: blockId, op }: BlockMessage.InsertText) => {
      const momId = socket.data.momId;

      try {
        await crdtManager.onInsertText(blockId, op);

        const message: BlockMessage.InsertedText = { id: blockId, op };
        socket.to(momId).emit(BLOCK_EVENT.INSERT_TEXT, message);
      } catch {
        const blockCrdt = await crdtManager.getBlockCRDT(blockId);

        const message: BlockMessage.InitializedText = {
          id: blockId,
          crdt: blockCrdt.data,
        };
        socket.emit(BLOCK_EVENT.INIT_TEXT, message);
      }
    },
  );

  socket.on(
    BLOCK_EVENT.DELETE_TEXT,
    async ({ id: blockId, op }: BlockMessage.DeleteText) => {
      const momId = socket.data.momId;

      try {
        await crdtManager.onDeleteText(blockId, op);

        const message: BlockMessage.DeletedText = { id: blockId, op };
        socket.to(momId).emit(BLOCK_EVENT.DELETE_TEXT, message);
      } catch {
        const blockCrdt = await crdtManager.getBlockCRDT(blockId);

        const message: BlockMessage.InitializedText = {
          id: blockId,
          crdt: blockCrdt.data,
        };
        socket.emit(BLOCK_EVENT.INIT_TEXT, message);
      }
    },
  );

  socket.on(
    BLOCK_EVENT.UPDATE_TEXT,
    async ({ id: blockId, ops }: BlockMessage.UpdateText) => {
      const momId = socket.data.momId;

      for await (const op of ops) {
        await crdtManager.onInsertText(blockId, op);
      }

      const blockCrdt = await crdtManager.getBlockCRDT(blockId);

      const message: BlockMessage.UpdatedText = {
        id: blockId,
        crdt: blockCrdt.data,
      };
      socket.to(momId).emit(BLOCK_EVENT.UPDATE_TEXT, message);
    },
  );
}
