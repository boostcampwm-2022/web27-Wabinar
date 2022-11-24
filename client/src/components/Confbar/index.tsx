import { IParticipant } from 'src/types/rtc';

import style from './style.module.scss';
import Video from './Video';

interface ConfBarProps {
  participants: IParticipant[];
}

function ConfBar({ participants }: ConfBarProps) {
  return (
    <div className={style['conf-bar']}>
      <ul>
        {participants.map(({ socketId, stream }) => (
          <div key={socketId}>
            {stream && (
              <li>
                <Video stream={stream} />
              </li>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ConfBar;
