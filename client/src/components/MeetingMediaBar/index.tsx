import { useEffect, useState } from 'react';
import useSocketContext from 'src/hooks/context/useSocketContext';
import {
  MeetingMediaStream,
  useMeetingMediaStreams,
} from 'src/hooks/useMeetingMediaStreams';

import MeetingMedia from './MeetingMedia';
import StreamButton from './StreamButton';
import style from './style.module.scss';

function MeetingMediaBar() {
  const { workspaceSocket: socket } = useSocketContext();
  const [streams, setLocalAudio, setLocalVideo] =
    useMeetingMediaStreams(socket);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    setLocalAudio(isMicOn);
  }, [isMicOn]);

  useEffect(() => {
    setLocalVideo(isCamOn);
  }, [isCamOn]);

  return (
    <div className={style['meeting-bar']}>
      <ul>
        {streams.map(
          ({ id, stream, type, audioOn, videoOn }: MeetingMediaStream) => (
            <li key={id}>
              <MeetingMedia stream={stream} muted={type === 'local'} />
              {type === 'remote' && (
                <StreamButton isMicOn={audioOn} isCamOn={videoOn} />
              )}
            </li>
          ),
        )}
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
