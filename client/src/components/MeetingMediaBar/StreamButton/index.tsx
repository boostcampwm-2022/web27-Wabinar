import { memo } from 'react';

import CamButton from './CamButton';
import MicButton from './MicButton';
import style from './style.module.scss';

interface StreamButtonProps {
  isMicOn?: boolean;
  isCamOn?: boolean;
}

function StreamButton({ isMicOn, isCamOn }: StreamButtonProps) {
  return (
    <div className={style['stream-button']}>
      <MicButton isOn={isMicOn} />
      <CamButton isOn={isCamOn} />
    </div>
  );
}

export default memo(StreamButton);
