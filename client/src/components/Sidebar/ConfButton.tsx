import { useMomContext } from 'src/hooks/useMomContext';
import useSocketContext from 'src/hooks/useSocketContext';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

function ConfButton() {
  const { momSocket: socket } = useSocketContext();

  const MomContext = useMomContext();
  const { isStart, setIsStart } = MomContext;

  const onClick = () => {
    setIsStart(!isStart);
    socket.emit(isStart ? 'stop-mom' : 'start-mom');
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

export default ConfButton;
