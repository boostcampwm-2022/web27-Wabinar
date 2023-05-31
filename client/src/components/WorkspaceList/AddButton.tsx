import { MdAdd } from '@react-icons/all-files/md/MdAdd';

import style from './style.module.scss';

interface AddButtonProps {
  onClick: React.MouseEventHandler;
}
function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      className={style.button}
      onClick={onClick}
      aria-label="추가"
      aria-haspopup="true"
    >
      <MdAdd size={20} color="white" />
    </button>
  );
}

export default AddButton;
