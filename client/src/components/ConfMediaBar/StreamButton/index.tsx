import { Dispatch, memo, SetStateAction } from 'react';

import CamButton from './CamButton';
import MicButton from './MicButton';
import style from './style.module.scss';

interface StreamButtonProps {
  isMicOn: boolean;
  isCamOn: boolean;
  setIsMicOn?: Dispatch<SetStateAction<boolean>>;
  setIsCamOn?: Dispatch<SetStateAction<boolean>>;
}

function StreamButton({
  isMicOn,
  isCamOn,
  setIsMicOn,
  setIsCamOn,
}: StreamButtonProps) {
  return (
    <div className={style['stream-button']}>
      <MicButton isOn={isMicOn} setIsMicOn={setIsMicOn} />
      <CamButton isOn={isCamOn} setIsCamOn={setIsCamOn} />
    </div>
  );
}

export default memo(StreamButton);
