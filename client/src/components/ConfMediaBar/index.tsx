import { useParams } from 'react-router-dom';
import { useConfMediaStreams } from 'src/hooks/useConfMediaStreams';
import useSocket from 'src/hooks/useSocket';

import ConfMedia from './ConfMedia';
import style from './style.module.scss';

function ConfMediaBar() {
  const { id } = useParams();
  const socket = useSocket(`/signaling/${id}`);
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
