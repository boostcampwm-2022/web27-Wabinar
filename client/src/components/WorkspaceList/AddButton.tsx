import { MdAdd } from '@react-icons/all-files/md/MdAdd';

import style from './style.module.scss';

function AddButton() {
  return (
    <button className={style.button}>
      <MdAdd color="white" size={20} />
    </button>
  );
}

export default AddButton;
