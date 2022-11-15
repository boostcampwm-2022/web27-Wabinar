import { BiCopy } from '@react-icons/all-files/bi/BiCopy';
import cx from 'classnames';

import Button from '../common/Button';
import Modal from '../common/Modal';
import style from './style.module.scss';

interface WorkspaceModalProps {
  title: string;
  texts: string[];
  btnText: string;
  inputValue: string;
  onChange?: (value: string) => void;
  onClose: () => void;
  onClick: () => void;
  isInputDisabled: boolean;
}

function WorkspaceModal({
  title,
  texts,
  btnText,
  inputValue,
  onChange,
  onClose,
  onClick,
  isInputDisabled,
}: WorkspaceModalProps) {
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
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
          {isInputDisabled && <BiCopy className={style['copy-icon']} />}
          <input
            className={cx(style.input, { [style.disabled]: isInputDisabled })}
            type="text"
            value={inputValue}
            onChange={onInput}
            disabled={isInputDisabled}
          />
        </div>

        <Button
          text={btnText}
          isDisable={!inputValue.length}
          onClick={onClick}
        />
      </>
    </Modal>
  );
}

export default WorkspaceModal;
