import { useEffect, useState } from 'react';
import { useConfMediaStreams } from 'src/hooks/useConfMediaStreams';
import useSocketContext from 'src/hooks/useSocketContext';

import ConfMedia from './ConfMedia';
import StreamButton from './StreamButton';
import style from './style.module.scss';

function ConfMediaBar() {
  const { workspaceSocket: socket } = useSocketContext();
  const [streams, setMyTrack] = useConfMediaStreams(socket);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    if (isMicOn) {
      setMyTrack('audio', true);
    } else {
      setMyTrack('audio', false);
    }
  }, [isMicOn]);

  useEffect(() => {
    if (isCamOn) {
      setMyTrack('video', true);
    } else {
      setMyTrack('video', false);
    }
  }, [isCamOn]);

  return (
    <div className={style['conf-bar']}>
      <ul>
        {Array.from(streams).map(([id, stream]) => (
          <li key={id}>
            <ConfMedia
              key={id}
              stream={stream}
              muted={id === 'me' ? true : false}
            />
            <StreamButton
              isMicOn={false}
              isCamOn={true} // TODO: 임시로 지정
            />
          </li>
        ))}
      </ul>
      <StreamButton
        {...{
          isMicOn,
          isCamOn,
          setIsMicOn,
          setIsCamOn,
        }}
      />
    </div>
  );
}

export default ConfMediaBar;
