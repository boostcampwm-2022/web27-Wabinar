import { MdAdd } from '@react-icons/all-files/md/MdAdd';
import React from 'react';

import style from './style.module.scss';

interface AddButtonProps {
  onClick: () => void;
}

function AddButton({ onClick }: AddButtonProps) {
  const onClickBtn = () => {
    onClick();
  };

  return (
    <button className={style.button} onClick={onClickBtn}>
      <MdAdd color="white" size={20} />
    </button>
  );
}

export default AddButton;
