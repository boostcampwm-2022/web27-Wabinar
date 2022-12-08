import { memo } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import { useMeetingContext } from 'src/hooks/useMeetingContext';
import useSocketContext from 'src/hooks/useSocketContext';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

function MeetingButton() {
  const { workspaceSocket: socket } = useSocketContext();

  const MeetingContext = useMeetingContext();
  const { isOnGoing, setIsOnGoing } = MeetingContext;

  const onClick = () => {
    setIsOnGoing(!isOnGoing);
    socket.emit(
      isOnGoing
        ? SOCKET_MESSAGE.WORKSPACE.END_MEETING
        : SOCKET_MESSAGE.WORKSPACE.START_MEETING,
    );
  };

  return (
    <button
      className={style['meeting-button']}
      onClick={onClick}
      style={{ backgroundColor: isOnGoing ? color.red : color.green }}
    >
      {isOnGoing ? '회의종료' : '회의시작'}
    </button>
  );
}

export default memo(MeetingButton);
