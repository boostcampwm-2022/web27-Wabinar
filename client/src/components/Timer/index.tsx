import env from 'config';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Timer() {
  const socket = io(env.SERVER_PATH + '/signaling');

  const [seconds, setSeconds] = useState(0);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    socket.on('set-time', ({ time, isStart }) => {
      setSeconds(time);
      setIsStart(isStart);
    });
  });

  useEffect(() => {
    if (isStart) {
      const countdown = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [seconds, isStart]);

  const onClick = () => {
    socket.emit('start-meeting');

    setIsStart(!isStart);
  };

  return (
    <div>
      <button onClick={onClick}>{!isStart ? '회의시작' : '회의중지'}</button>
      {String(Math.floor(seconds / 60)).padStart(2, '0') +
        ':' +
        String(seconds % 60).padStart(2, '0')}
    </div>
  );
}

export default Timer;
