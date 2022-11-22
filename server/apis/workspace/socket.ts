import { getMom } from '@apis/mom/service';
import { Server } from 'socket.io';

function workspaceSocketServer(io: Server) {
  const workspace = io.of(/^\/sc-workspace\/\d+$/);

  workspace.on('connection', (socket) => {
    const name = socket.nsp.name;
    const workspaceId = name.match(/\d+/g)[0];

    if (!workspaceId) {
      socket.on('disconnect', () => {
        console.log('존재하지 않는 워크스페이스^^');
      });
      return;
    }

    workspace.emit('hello');

    /* 회의록 선택 시 회의록 정보 불러오기 */
    socket.on('mom-select', async (roomId) => {
      socket.join(roomId);

      const mom = await getMom(roomId);
      workspace.to(roomId).emit('mom-selected', mom);
    });
  });
}

export default workspaceSocketServer;
