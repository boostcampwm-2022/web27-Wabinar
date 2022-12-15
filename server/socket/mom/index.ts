import { Server } from 'socket.io';

import { getBlockType, putBlockType } from '@apis/mom/block/service';
import { putMomTitle } from '@apis/mom/service';
import CrdtManager from '@utils/crdt-manager';
import { BLOCK_EVENT, MOM_EVENT } from '@wabinar/constants/socket-message';
import * as MomMessage from '@wabinar/api-types/mom';
import * as BlockMessage from '@wabinar/api-types/block';

import handleQuestionBlock from './handleQuestionBlock';
import handleTextBlock from './handleTextBlock';
import handleVoteBlock from './handleVoteBlock';

async function momSocketServer(io: Server) {
  const workspace = io.of(/^\/workspace-mom\/\d+$/);

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

      // TODO: 메세지 인터페이스 추가, 클라이언트 Mom 타입 정의 반영
      io.of(namespace).emit(MOM_EVENT.CREATE, { mom });
    });

    /* 회의록 선택하기 */
    socket.on(MOM_EVENT.SELECT, async ({ id: momId }: MomMessage.Select) => {
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
      // TODO: 메세지 인터페이스 추가
      socket.emit(MOM_EVENT.SELECT, { mom });
    });

    socket.on(
      MOM_EVENT.UPDATE_TITLE,
      async ({ title }: MomMessage.UpdateTitle) => {
        const momId = socket.data.momId;

        await putMomTitle(momId, title);

        const message: MomMessage.UpdatedTitle = { title };
        socket.to(momId).emit(MOM_EVENT.UPDATE_TITLE, message);
      },
    );

    const initMom = async (id: string) => {
      const momCrdt = await crdtManager.getMomCRDT(id);

      const message: MomMessage.Initialized = { crdt: momCrdt.data };
      socket.emit(MOM_EVENT.INIT, message);
    };

    socket.on(MOM_EVENT.INIT, async () => {
      const momId = socket.data.momId;

      initMom(momId);
    });

    socket.on(
      MOM_EVENT.INSERT_BLOCK,
      async ({ blockId, op }: MomMessage.InsertBlock) => {
        const momId = socket.data.momId;

        try {
          await crdtManager.onInsertBlock(momId, blockId, op);

          socket.emit(MOM_EVENT.UPDATED);

          const message: MomMessage.InsertedBlock = { op };
          socket.to(momId).emit(MOM_EVENT.INSERT_BLOCK, message);
        } catch {
          initMom(momId);
        }
      },
    );

    socket.on(
      MOM_EVENT.DELETE_BLOCK,
      async ({ blockId, op }: MomMessage.DeleteBlock) => {
        const momId = socket.data.momId;

        try {
          await crdtManager.onDeleteBlock(momId, blockId, op);

          const message: MomMessage.DeletedBlock = { op };
          socket.to(momId).emit(MOM_EVENT.DELETE_BLOCK, message);
        } catch {
          initMom(momId);
        }
      },
    );

    socket.on(
      BLOCK_EVENT.LOAD_TYPE,
      async ({ id: blockId }: BlockMessage.LoadType, callback) => {
        const type = await getBlockType(blockId);

        const message: BlockMessage.LoadedType = { type };
        callback(message);
      },
    );

    socket.on(
      BLOCK_EVENT.UPDATE_TYPE,
      async ({ id: blockId, type }: BlockMessage.UpdateType) => {
        const momId = socket.data.momId;

        await putBlockType(blockId, type);

        const message: BlockMessage.UpdatedType = { id: blockId, type };
        socket.to(momId).emit(BLOCK_EVENT.UPDATE_TYPE, message);
      },
    );

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
