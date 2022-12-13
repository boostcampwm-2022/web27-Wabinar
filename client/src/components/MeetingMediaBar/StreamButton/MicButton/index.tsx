import { MdMic } from '@react-icons/all-files/md/MdMic';
import { MdMicOff } from '@react-icons/all-files/md/MdMicOff';
import color from 'styles/color.module.scss';

interface MicButtonProps {
  isOn: boolean;
  onClick?: () => void;
}

function MicButton({ isOn, onClick }: MicButtonProps) {
  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return (
    <button
      onClick={onClickBtn}
      aria-label={'마이크 ' + (isOn ? '끄기' : '켜기')}
    >
      {isOn ? (
        <MdMic color={color.green} size={20} />
      ) : (
        <MdMicOff color={color.red} size={20} />
      )}
    </button>
  );
}

export default MicButton;
