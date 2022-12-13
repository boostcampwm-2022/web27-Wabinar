import { MdVideocam } from '@react-icons/all-files/md/MdVideocam';
import { MdVideocamOff } from '@react-icons/all-files/md/MdVideocamOff';
import color from 'styles/color.module.scss';

interface CamButtonProps {
  isOn: boolean;
  onClick?: () => void;
}

function CamButton({ isOn, onClick }: CamButtonProps) {
  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return (
    <button onClick={onClickBtn} aria-label={'캠 ' + (isOn ? '끄기' : '켜기')}>
      {isOn ? (
        <MdVideocam color={color.green} size={20} />
      ) : (
        <MdVideocamOff color={color.red} size={20} />
      )}
    </button>
  );
}

export default CamButton;
