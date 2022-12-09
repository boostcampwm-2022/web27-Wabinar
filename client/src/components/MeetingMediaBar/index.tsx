import { useEffect, useState } from 'react';
import { useMeetingMediaStreams } from 'src/hooks/useMeetingMediaStreams';
import useSocketContext from 'src/hooks/useSocketContext';

import MeetingMedia from './MeetingMedia';
import StreamButton from './StreamButton';
import style from './style.module.scss';

function MeetingMediaBar() {
  const { workspaceSocket: socket } = useSocketContext();
  const [streams, setMyTrack] = useMeetingMediaStreams(socket);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    setMyTrack('audio', isMicOn);
  }, [isMicOn]);

  useEffect(() => {
    setMyTrack('video', isCamOn);
  }, [isCamOn]);

  return (
    <div className={style['meeting-bar']}>
      <ul>
        {Array.from(streams).map(([id, stream]) => (
          <li key={id}>
            <MeetingMedia
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

export default MeetingMediaBar;
