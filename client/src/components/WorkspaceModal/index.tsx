import Button from '../common/Button';
import Modal from '../common/Modal';
import style from './style.module.scss';

interface WorkspaceModalProps {
  title: string;
  text: string;
  btnText: string;
  inputValue: string;
  onChange?: (value: string) => void;
}

function WorkspaceModal({
  title,
  text,
  btnText,
  inputValue,
  onChange,
}: WorkspaceModalProps) {
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <Modal title={title}>
      <>
        <span className={style.text}>{text}</span>
        <input className={style.input} type="text" onChange={onInput} />
        <Button text={btnText} isDisable={!inputValue.length} />
      </>
    </Modal>
  );
}

export default WorkspaceModal;
