import * as Questions from '@apis/mom/questions/service';
import { createVote, endVote, updateVote } from '@apis/mom/vote/service';
import SOCKET_MESSAGE from '@constants/socket-message';
import CrdtManager from '@utils/crdt-manager';
import { Namespace, Server, Socket } from 'socket.io';

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

      workspace.emit(SOCKET_MESSAGE.MOM.CREATE, mom);
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

    /* crdt for Mom */
    socket.on('mom-initialization', async () => {
      const momId = socket.data.momId;

      const momCrdt = await crdtManager.getMomCRDT(momId);

      socket.emit('mom-initialization', momCrdt.data);
    });

    socket.on('block-insertion', async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onInsertBlock(momId, blockId, op);

      socket.emit('block-op-reflected');
      socket.to(momId).emit('block-insertion', op);
    });

    socket.on('block-deletion', async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onDeleteBlock(momId, blockId, op);

      socket.emit('block-op-reflected');
      socket.to(momId).emit('block-deletion', op);
    });

    /* crdt for Block */
    socket.on('block-initialization', async (blockId) => {
      const blockCrdt = await crdtManager.getBlockCRDT(blockId);

      socket.emit('block-initialization', blockId, blockCrdt.data);
    });

    socket.on('text-insertion', async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onInsertText(blockId, op);

      socket.to(momId).emit('text-insertion', blockId, op);
    });

    socket.on('text-deletion', async (blockId, op) => {
      const momId = socket.data.momId;

      await crdtManager.onDeleteText(blockId, op);

      socket.to(momId).emit('text-deletion', blockId, op);
    });

    addEventHandlersForQuestionBlock(workspace, socket);

    /* 투표 관련 이벤트 */
    socket.on(SOCKET_MESSAGE.MOM.CREATE_VOTE, (momId, vote) => {
      const newVote = createVote(momId, vote);
      workspace.emit(SOCKET_MESSAGE.MOM.CREATE_VOTE, newVote);
    });

    socket.on(SOCKET_MESSAGE.MOM.UPDATE_VOTE, (momId, optionId) => {
      const res = updateVote(momId, Number(optionId));
      const message = res ? '투표 성공' : '투표 실패';

      socket.emit(SOCKET_MESSAGE.MOM.UPDATE_VOTE, message);
    });

    socket.on(SOCKET_MESSAGE.MOM.END_VOTE, (momId) => {
      const res = endVote(momId);
      workspace.emit(SOCKET_MESSAGE.MOM.END_VOTE, res);
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
