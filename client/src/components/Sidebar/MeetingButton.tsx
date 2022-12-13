import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import { memo } from 'react';
import useMeetingContext from 'src/hooks/context/useMeetingContext';
import useSocketContext from 'src/hooks/context/useSocketContext';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

function MeetingButton() {
  const { workspaceSocket: socket } = useSocketContext();

  const MeetingContext = useMeetingContext();
  const { isOnGoing, setIsOnGoing } = MeetingContext;

  const onClick = () => {
    if (isOnGoing) {
      socket.emit('bye');
    }
    if (isOnGoing) {
      socket.emit('bye');
    }
    setIsOnGoing(!isOnGoing);
  };

  return (
    <button
      className={style['meeting-button']}
      onClick={onClick}
      style={{ backgroundColor: isOnGoing ? color.red : color.green }}
    >
      {isOnGoing ? '회의퇴장' : '회의참여'}
    </button>
  );
}

export default memo(MeetingButton);
