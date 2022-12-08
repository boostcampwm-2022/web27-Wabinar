import { Server } from 'socket.io';

import { getBlockType, putBlockType } from '@apis/mom/block/service';
import { putMomTitle } from '@apis/mom/service';
import CrdtManager from '@utils/crdt-manager';
import { BLOCK_EVENT, MOM_EVENT } from '@wabinar/constants/socket-message';

import handleQuestionBlock from './handleQuestionBlock';
import handleTextBlock from './handleTextBlock';
import handleVoteBlock from './handleVoteBlock';

async function momSocketServer(io: Server) {
  const workspace = io.of(/^\/sc-workspace\/\d+$/);

  const crdtManager = new CrdtManager();

  workspace.on('connection', async (socket) => {
    const namespace = socket.nsp.name;
    const workspaceId = namespace.match(/\d+/g)[0];

    if (!workspaceId) {
      socket.disconnect();
      return;
    }

    /* 회의록 추가하기 */
    socket.on(MOM_EVENT.CREATE, async () => {
      const mom = await crdtManager.onCreateMom(workspaceId);

      io.of(namespace).emit(MOM_EVENT.CREATE, mom);
    });

    /* 회의록 선택하기 */
    socket.on(MOM_EVENT.SELECT, async (momId) => {
      // 기존 join 되어있던 room은 leave
      const joinedRooms = [
        ...io.of(namespace).adapter.socketRooms(socket.id),
      ].filter((id) => id !== socket.id);

      joinedRooms.forEach((room) => socket.leave(room));

      // 선택된 회의록 room에 join
      socket.join(momId);
      socket.data.momId = momId;

      const mom = await crdtManager.onSelectMom(momId);

      // 선택된 회의록의 정보 전달
      socket.emit(MOM_EVENT.SELECT, mom);
    });

    socket.on(MOM_EVENT.UPDATE_TITLE, async (title: string) => {
      const momId = socket.data.momId;

      await putMomTitle(momId, title);

      socket.to(momId).emit(MOM_EVENT.UPDATE_TITLE, title);
    });

    /* crdt for Mom */
    socket.on(MOM_EVENT.INIT, async () => {
      const momId = socket.data.momId;

      const momCrdt = await crdtManager.getMomCRDT(momId);

      socket.emit(MOM_EVENT.INIT, momCrdt.data);
    });

    socket.on(MOM_EVENT.INSERT_BLOCK, async (blockId, op) => {
      const momId = socket.data.momId;

      try {
        await crdtManager.onInsertBlock(momId, blockId, op);

        socket.emit(MOM_EVENT.UPDATED);
        socket.to(momId).emit(MOM_EVENT.INSERT_BLOCK, op);
      } catch {
        const momCrdt = await crdtManager.getMomCRDT(momId);

        socket.emit(MOM_EVENT.INIT, momCrdt.data);
      }
    });

    socket.on(MOM_EVENT.DELETE_BLOCK, async (blockId, op) => {
      const momId = socket.data.momId;

      try {
        await crdtManager.onDeleteBlock(momId, blockId, op);

        socket.to(momId).emit(MOM_EVENT.DELETE_BLOCK, op);
      } catch {
        const momCrdt = await crdtManager.getMomCRDT(momId);

        socket.emit(MOM_EVENT.INIT, momCrdt.data);
      }
    });

    socket.on(BLOCK_EVENT.LOAD_TYPE, async (blockId, callback) => {
      const type = await getBlockType(blockId);

      callback(type);
    });

    socket.on(BLOCK_EVENT.UPDATE_TYPE, async (blockId, type) => {
      const momId = socket.data.momId;

      await putBlockType(blockId, type);

      socket.to(momId).emit(BLOCK_EVENT.UPDATE_TYPE, blockId, type);
    });

    handleTextBlock(socket, crdtManager);
    handleVoteBlock(io, namespace, socket);
    handleQuestionBlock(io, namespace, socket);

    socket.on('error', (err) => {
      console.log(err);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });
}

export default momSocketServer;
