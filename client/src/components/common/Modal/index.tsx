import { MdClose } from '@react-icons/all-files/md/MdClose';
import Portal from 'src/components/Portal';

import style from './style.module.scss';

interface ModalProps {
  title?: string;
  isHaveCloseBtn?: boolean;
  children: JSX.Element;
  className?: string;
}

function Modal({ title, children }: ModalProps) {
  const onClose = () => {
    //
  };

  return (
    <Portal>
      <div
        className={style.modal}
        role="alertdialog"
        aria-modal
        aria-labelledby="modal"
      >
        <div className={style.dimmer} onClick={onClose} tabIndex={0} />
        <div className={style['out-container']}>
          <div className={style.header} id="modal-heading">
            <h2 className={style.title}>{title}</h2>
            <button className={style['close-modal']}>
              <MdClose size={20} color={'white'} />
            </button>
          </div>
          <div className={style['inner-container']} role="document">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default Modal;
