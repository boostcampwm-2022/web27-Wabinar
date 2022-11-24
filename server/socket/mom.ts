import { createMom, getMom } from '@apis/mom/service';
import { Server } from 'socket.io';

function momSocketServer(io: Server) {
  const workspace = io.of(/^\/sc-workspace\/\d+$/);

  workspace.on('connection', (socket) => {
    const name = socket.nsp.name;
    const workspaceId = name.match(/\d+/g)[0];

    if (!workspaceId) {
      socket.disconnect();
      return;
    }

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
      workspace.emit('mom-insertion', op);
    });

    socket.on('mom-deletion', async (op) => {
      workspace.emit('mom-deletion', op);
    });

    // 에러 시
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
