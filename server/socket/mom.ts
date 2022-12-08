import * as Questions from '@apis/mom/questions/service';
import { putMomTitle } from '@apis/mom/service';
import {
  createVote,
  endVote,
  Option,
  updateVote,
} from '@apis/mom/vote/service';
import SOCKET_MESSAGE from '@constants/socket-message';
import CrdtManager from '@utils/crdt-manager';
import { Namespace, Server, Socket } from 'socket.io';

import { getBlockType, putBlockType } from '@apis/mom/block/service';

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
    socket.on(SOCKET_MESSAGE.MOM.CREATE, async () => {
      const mom = await crdtManager.onCreateMom(workspaceId);

      io.of(namespace).emit(SOCKET_MESSAGE.MOM.CREATE, mom);
    });

    /* 회의록 선택하기 */
    socket.on(SOCKET_MESSAGE.MOM.SELECT, async (momId) => {
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
      socket.emit(SOCKET_MESSAGE.MOM.SELECT, mom);
    });

    socket.on(SOCKET_MESSAGE.MOM.UPDATE_TITLE, async (title: string) => {
      const momId = socket.data.momId;

      await putMomTitle(momId, title);

      socket.to(momId).emit(SOCKET_MESSAGE.MOM.UPDATE_TITLE, title);
    });

    /* crdt for Mom */
    socket.on(SOCKET_MESSAGE.MOM.INIT, async () => {
      const momId = socket.data.momId;

      const momCrdt = await crdtManager.getMomCRDT(momId);

      socket.emit(SOCKET_MESSAGE.MOM.INIT, momCrdt.data);
    });

    socket.on(SOCKET_MESSAGE.MOM.INSERT_BLOCK, async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onInsertBlock(momId, blockId, op);

      socket.emit(SOCKET_MESSAGE.MOM.UPDATED);
      socket.to(momId).emit(SOCKET_MESSAGE.MOM.INSERT_BLOCK, op);
    });

    socket.on(SOCKET_MESSAGE.MOM.DELETE_BLOCK, async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onDeleteBlock(momId, blockId, op);

      socket.emit(SOCKET_MESSAGE.MOM.UPDATED);
      socket.to(momId).emit(SOCKET_MESSAGE.MOM.DELETE_BLOCK, op);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.LOAD_TYPE, async (blockId, callback) => {
      const type = await getBlockType(blockId);

      callback(type);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.UPDATE_TYPE, async (blockId, type) => {
      const momId = socket.data.momId;

      await putBlockType(blockId, type);

      socket.to(momId).emit(SOCKET_MESSAGE.BLOCK.UPDATE_TYPE, blockId, type);
    });

    /* crdt for Block */
    socket.on(SOCKET_MESSAGE.BLOCK.INIT, async (blockId) => {
      const blockCrdt = await crdtManager.getBlockCRDT(blockId);

      socket.emit(SOCKET_MESSAGE.BLOCK.INIT, blockId, blockCrdt.data);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.INSERT_TEXT, async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onInsertText(blockId, op);

      socket.to(momId).emit(SOCKET_MESSAGE.BLOCK.INSERT_TEXT, blockId, op);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.DELETE_TEXT, async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onDeleteText(blockId, op);

      socket.to(momId).emit(SOCKET_MESSAGE.BLOCK.DELETE_TEXT, blockId, op);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.UPDATE_TEXT, async (blockId, ops) => {
      const momId = socket.data.momId;

      for await (const op of ops) {
        await crdtManager.onInsertText(blockId, op);
      }

      const blockCrdt = await crdtManager.getBlockCRDT(blockId);

      socket
        .to(momId)
        .emit(SOCKET_MESSAGE.BLOCK.UPDATE_TEXT, blockId, blockCrdt.data);
    });

    addEventHandlersForQuestionBlock(workspace, socket);

    /* 투표 관련 이벤트 */
    socket.on(SOCKET_MESSAGE.MOM.CREATE_VOTE, (momId, options: Option[]) => {
      const newVote = createVote(momId, options);
      socket.to(momId).emit(SOCKET_MESSAGE.MOM.CREATE_VOTE, newVote);
    });

    socket.on(SOCKET_MESSAGE.MOM.UPDATE_VOTE, (momId, optionId, userId) => {
      const participantCount = updateVote(momId, Number(optionId), userId);

      io.of(namespace)
        .to(momId)
        .emit(SOCKET_MESSAGE.MOM.UPDATE_VOTE, participantCount);
    });

    socket.on(SOCKET_MESSAGE.MOM.END_VOTE, (momId) => {
      const res = endVote(momId);
      io.of(namespace).to(momId).emit(SOCKET_MESSAGE.MOM.END_VOTE, res);
    });

    socket.on('error', (err) => {
      console.log(err);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });
}

function addEventHandlersForQuestionBlock(
  namespace: Namespace,
  socket: Socket,
) {
  socket.on('question-block__fetch-questions', () => {
    const questions = Questions.fetch();

    socket.emit('question-block__questions-fetched', questions);
  });

  socket.on('question-block__add-question', (question) => {
    Questions.add(question);

    namespace.emit('question-block__question-added', question);
  });

  socket.on('question-block__toggle-resolved', (id, toggledResolved) => {
    Questions.toggleResolved(id, toggledResolved);
    const questions = Questions.fetch();

    namespace.emit('question-block__questions-fetched', questions);
  });
}

export default momSocketServer;
