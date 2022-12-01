import { memo } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import { useConfContext } from 'src/hooks/useConfContext';
import useSocketContext from 'src/hooks/useSocketContext';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

function ConfButton() {
  const { workspaceSocket: socket } = useSocketContext();

  const ConfContext = useConfContext();
  const { isStart, setIsStart } = ConfContext;

  const onClick = () => {
    setIsStart(!isStart);
    socket.emit(
      isStart
        ? SOCKET_MESSAGE.WORKSPACE.END_MOM
        : SOCKET_MESSAGE.WORKSPACE.START_MOM,
    );
  };

  return (
    <button
      className={style['conf-button']}
      onClick={onClick}
      style={{ backgroundColor: isStart ? color.red : color.green }}
    >
      {isStart ? '회의종료' : '회의시작'}
    </button>
  );
}

export default memo(ConfButton);
