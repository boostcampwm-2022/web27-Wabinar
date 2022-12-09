import { MdVideocam } from '@react-icons/all-files/md/MdVideocam';
import { MdVideocamOff } from '@react-icons/all-files/md/MdVideocamOff';
import { Dispatch, SetStateAction } from 'react';
import color from 'styles/color.module.scss';

interface CamButtonProps {
  isOn: boolean;
  setIsCamOn?: Dispatch<SetStateAction<boolean>>;
}

function CamButton({ isOn, setIsCamOn }: CamButtonProps) {
  const onClick = () => {
    if (setIsCamOn) setIsCamOn(!isOn);
  };

  return (
    <button onClick={onClick} aria-label={'캠 ' + (isOn ? '끄기' : '켜기')}>
      {isOn ? (
        <MdVideocam color={color.green} size={20} />
      ) : (
        <MdVideocamOff color={color.red} size={20} />
      )}
    </button>
  );
}

export default CamButton;
