import { io } from 'socket.io-client';
import env from 'src/config';
import { useConfMediaStreams } from 'src/hooks/useConfMediaStreams';

import ConfMedia from './ConfMedia';
import style from './style.module.scss';

interface ConfMediaBarProps {
  workspaceId?: string;
}

function ConfMediaBar({ workspaceId }: ConfMediaBarProps) {
  const socketUrl = `${env.SERVER_PATH}/signaling/${workspaceId}`;
  const socket = io(socketUrl);

  const streams = useConfMediaStreams(socket);

  return (
    <div className={style['conf-bar']}>
      <ul>
        {Array.from(streams).map(([id, stream]) => (
          <li key={id}>
            <ConfMedia key={id} stream={stream} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConfMediaBar;
