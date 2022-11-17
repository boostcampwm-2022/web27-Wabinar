import { BiCopy } from '@react-icons/all-files/bi/BiCopy';
import cx from 'classnames';
import { useState } from 'react';

import Button from '../common/Button';
import Modal from '../common/Modal';
import style from './style.module.scss';

export interface ModalContents {
  title: string;
  texts: string[];
  btnText: string;
}

interface ModalContainerProps {
  title: string;
  texts: string[];
  btnText: string;
  onClose: () => void;
  onSubmit: () => void;
  isDisabled?: boolean;
}

function FormModal({
  title,
  texts,
  btnText,
  onClose,
  onSubmit,
  isDisabled = false,
}: ModalContainerProps) {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <>
        {texts.map((text) => (
          <p key={text} className={style.text}>
            {text}
          </p>
        ))}

        <div className={style['input-section']}>
          {isDisabled && <BiCopy className={style['copy-icon']} />}
          <input
            className={cx(style.input, { [style.disabled]: isDisabled })}
            type="text"
            value={inputValue}
            onChange={onChange}
            disabled={isDisabled}
          />
        </div>

        <Button
          text={btnText}
          isDisabled={!inputValue.length}
          onClick={onSubmit}
        />
      </>
    </Modal>
  );
}

export default FormModal;
