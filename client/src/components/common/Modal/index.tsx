import { MdClose } from '@react-icons/all-files/md/MdClose';
import classNames from 'classnames/bind';
import Portal from 'common/Modal/Portal';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface ModalProps {
  title?: string;
  isDark?: boolean;
  children: JSX.Element;
  onClose: () => void;
}

function Modal({ title, isDark = false, children, onClose }: ModalProps) {
  return (
    <Portal>
      <div
        className={cx(style.modal, { 'dark-modal': isDark })}
        role="alertdialog"
        aria-modal
        aria-labelledby="modal"
      >
        <div className={style.dimmer} onClick={onClose} tabIndex={0} />

        <div className={style['out-container']}>
          <div className={style.header} id="modal-heading">
            <h2 className={style.title}>{title}</h2>
            <button
              className={style['close-modal']}
              onClick={onClose}
              aria-label="모달 창 닫기"
            >
              <MdClose size={20} color={'white'} />
            </button>
          </div>

          <div className={style['inner-container']} role="form">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default Modal;
