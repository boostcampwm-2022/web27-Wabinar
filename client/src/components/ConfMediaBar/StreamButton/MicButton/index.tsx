import { MdMic } from '@react-icons/all-files/md/MdMic';
import { MdMicOff } from '@react-icons/all-files/md/MdMicOff';
import { Dispatch, SetStateAction } from 'react';
import color from 'styles/color.module.scss';

interface MicButtonProps {
  isOn: boolean;
  setIsMicOn?: Dispatch<SetStateAction<boolean>>;
}

function MicButton({ isOn, setIsMicOn }: MicButtonProps) {
  const onClick = () => {
    if (setIsMicOn) setIsMicOn(!isOn);
  };

  return (
    <button onClick={onClick} aria-label={'마이크 ' + (isOn ? '끄기' : '켜기')}>
      {isOn ? (
        <MdMic color={color.green} size={20} />
      ) : (
        <MdMicOff color={color.red} size={20} />
      )}
    </button>
  );
}

export default MicButton;
