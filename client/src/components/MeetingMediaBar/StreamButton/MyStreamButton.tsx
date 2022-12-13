import { memo } from 'react';
import { useCreateMediaStream } from 'src/hooks/useCreateMediaStream';
import useMyMediaStreamContext from 'src/hooks/useMyMediaStream';

import CamButton from './CamButton';
import MicButton from './MicButton';
import style from './style.module.scss';

function MyStreamButton() {
  const { isMyMicOn, isMyCamOn, setIsMyMicOn } = useMyMediaStreamContext();
  const { myMediaStream } = useMyMediaStreamContext();
  const { createVideoStream, toggleVideoStream } = useCreateMediaStream();

  const onClickMicButton = () => {
    if (!myMediaStream) return;
    myMediaStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    const changed = !isMyMicOn;
    setIsMyMicOn(changed);
  };

  const onClickCamButton = () => {
    if (!isMyCamOn) createVideoStream();
    else toggleVideoStream(!isMyCamOn);
  };

  return (
    <div className={style['stream-button']}>
      <MicButton isOn={isMyMicOn} onClick={onClickMicButton} />
      <CamButton isOn={isMyCamOn} onClick={onClickCamButton} />
    </div>
  );
}

export default memo(MyStreamButton);
