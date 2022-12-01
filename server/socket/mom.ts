import { createMom, getMom, putMom } from '@apis/mom/service';
import { createVote, stopVote, updateVote } from '@apis/mom/vote/service';
import CRDT from '@wabinar/crdt';
import { Server, Socket, Namespace } from 'socket.io';
import LinkedList from '@wabinar/crdt/linked-list';
import * as Questions from '@apis/mom/questions/service';

async function momSocketServer(io: Server) {
  const workspace = io.of(/^\/sc-workspace\/\d+$/);

  // 회의록 id : 회의록의 crdt 인스턴스
  const momMap = new Map<string, CRDT>();

  workspace.on('connection', async (socket) => {
    const namespace = socket.nsp.name;
    const workspaceId = namespace.match(/\d+/g)[0];

    if (!workspaceId) {
      socket.disconnect();
      return;
    }

    // TODO: 회의 시작과 종료, 소켓 관심사 리팩토링
    socket.on('start-mom', () => {
      workspace.emit('started-mom');
    });

    socket.on('stop-mom', () => {
      workspace.emit('stoped-mom');
    });

    /* 회의록 추가하기 */
    socket.on('create-mom', async () => {
      const mom = await createMom(workspaceId);
      const { _id, head, nodeMap } = mom;

      momMap.set(
        _id.toString(),
        new CRDT(1, -1, { head, nodeMap } as LinkedList),
      );

      workspace.emit('created-mom', mom);
    });

    /* 회의록 선택하기 */
    socket.on('select-mom', async (momId) => {
      // 기존 join 되어있던 room은 leave
      const joinedRooms = [
        ...io.of(namespace).adapter.socketRooms(socket.id),
      ].filter((id) => id !== socket.id);

      joinedRooms.forEach((room) => socket.leave(room));

      // 선택된 회의록 room에 join
      socket.join(momId);
      socket.data.momId = momId;

      const mom = await getMom(momId);

      // 서버에 선택된 회의록의 crdt가 없다면 생성
      if (!momMap.has(momId)) {
        const { head, nodeMap } = mom;

        momMap.set(momId, new CRDT(1, -1, { head, nodeMap } as LinkedList));
      }

      // 선택된 회의록의 정보 전달
      socket.emit('selected-mom', mom);
    });

    /* crdt initialization */
    socket.on('mom-initialization', async () => {
      const crdt = momMap.get(socket.data.momId);

      socket.emit('mom-initialization', crdt.data);
    });

    /* crdt remote insert delete */
    socket.on('mom-insertion', async (op) => {
      const momId = socket.data.momId;
      socket.to(momId).emit('mom-insertion', op);

      const crdt = momMap.get(momId);
      crdt.remoteInsert(op);

      putMom(momId, crdt.plainData);
    });

    socket.on('mom-deletion', async (op) => {
      const momId = socket.data.momId;
      socket.to(momId).emit('mom-deletion', op);

      const crdt = momMap.get(momId);
      crdt.remoteDelete(op);

      putMom(momId, crdt.plainData);
    });

    addEventHandlersForQuestionBlock(workspace, socket);
    
    /* 투표 관련 이벤트 */
    socket.on('create-vote', (momId, vote) => {
      const newVote = createVote(momId, vote);
      workspace.emit('created-vote', newVote);
    });

    socket.on('update-vote', (momId, optionId) => {
      const res = updateVote(momId, Number(optionId));
      const message = res ? '투표 성공' : '투표 실패';

      socket.emit('updated-vote', message);
    });

    socket.on('stop-vote', (momId) => {
      const res = stopVote(momId);
      workspace.emit('stoped-vote', res);
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
