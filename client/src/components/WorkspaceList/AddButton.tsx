import { MdAdd } from '@react-icons/all-files/md/MdAdd';

import style from './style.module.scss';

interface AddButtonProps {
  onClick: React.MouseEventHandler;
}
function AddButton({ onClick }: AddButtonProps) {
  return <MdAdd onClick={onClick} className={style.button} size={20} />;
}

export default AddButton;
