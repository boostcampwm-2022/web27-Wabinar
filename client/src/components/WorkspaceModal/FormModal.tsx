import cx from 'classnames';
import Button from 'src/components/common/Button';
import CopyButton from 'src/components/common/CopyButton';
import Modal from 'src/components/common/Modal';

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
  inputValue: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
  isDisabled?: boolean;
  errorMessage?: string;
}

function FormModal({
  title,
  texts,
  btnText,
  onClose,
  onSubmit,
  inputValue,
  setInputValue,
  isDisabled = false,
  errorMessage = undefined,
}: ModalContainerProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setInputValue) setInputValue(e.target.value);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <>
        {texts.map((text) => (
          <p key={text} className={style['text']}>
            {text}
          </p>
        ))}

        <div className={style['input-section']}>
          {isDisabled && (
            <CopyButton target={inputValue} className={style['copy-icon']} />
          )}
          <input
            className={cx(style.input, {
              [style.disabled]: isDisabled,
              [style.invalid]: !!errorMessage,
            })}
            type="text"
            value={inputValue}
            onChange={onChange}
            disabled={isDisabled}
            autoFocus
          />
        </div>

        {<p className={style['error-message']}>{errorMessage}</p>}

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
