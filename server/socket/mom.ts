import { createMom, getMom, putMom } from '@apis/mom/service';
import CRDT from '@wabinar/crdt';
import { Server } from 'socket.io';

async function momSocketServer(io: Server) {
  const momId = '6380c9f7b757041ca21fe96c';

  const { structure } = await getMom(momId);

  const crdt = new CRDT(1, -1, structure);

  const workspace = io.of(/^\/api\/sc-workspace\/\d+$/);

  workspace.on('connection', async (socket) => {
    const name = socket.nsp.name;
    const workspaceId = name.match(/\d+/g)[0];

    if (!workspaceId) {
      socket.disconnect();
      return;
    }

    socket.on('start-mom', () => {
      workspace.emit('started-mom');
    });

    socket.on('stop-mom', () => {
      workspace.emit('stoped-mom');
    });

    /* 회의록 선택 시 회의록 정보 불러오기 */
    socket.on('select-mom', async (roomId) => {
      socket.join(roomId);

      const mom = await getMom(roomId);
      socket.emit('selected-mom', mom);
    });

    /* 회의록 추가하기 */
    socket.on('create-mom', async () => {
      const mom = await createMom();
      workspace.emit('created-mom', mom);
    });

    /* crdt remote insert delete */
    socket.on('mom-insertion', async (op) => {
      socket.broadcast.emit('mom-insertion', op);
      crdt.remoteInsert(op);

      putMom(momId, crdt.data);
    });

    socket.on('mom-deletion', async (op) => {
      socket.broadcast.emit('mom-deletion', op);
      crdt.remoteDelete(op);

      putMom(momId, crdt.data);
    });

    // 에러 시
    socket.on('error', (err) => {
      console.log(err);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });

    // 초기화에 필요한 정보 전달
    const { structure } = await getMom(momId);

    socket.emit('mom-initialization', structure);
  });
}

export default momSocketServer;
