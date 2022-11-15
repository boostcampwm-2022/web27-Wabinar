import cx from 'classnames';
import Portal from 'src/components/Portal';

import style from './style.module.scss';

interface SelcetModalProps {
  children: JSX.Element;
  className?: string;
  onClose: () => void;
}

function SelcetModal({ children, className, onClose }: SelcetModalProps) {
  const onClickCloseBtn = () => {
    onClose();
  };

  return (
    <Portal>
      <div
        className={style.modal}
        role="alertdialog"
        aria-modal
        aria-labelledby="modal"
      >
        <div className={cx(style.container, className)}>{children}</div>
        <div
          className={style.dimmer}
          onClick={onClickCloseBtn}
          tabIndex={0}
        ></div>
      </div>
    </Portal>
  );
}

export default SelcetModal;
