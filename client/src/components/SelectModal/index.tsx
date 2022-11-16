import cx from 'classnames';

import style from './style.module.scss';

interface SelcetModalProps {
  children: JSX.Element;
  className?: string;
  onClose: () => void;
}

function SelcetModal({ children, className, onClose }: SelcetModalProps) {
  return (
    <div className={cx(style.container)}>
      <div
        className={cx(style.modal, className)}
        aria-modal
        aria-labelledby="modal"
      >
        {children}
      </div>
      <div className={style.dimmer} onClick={onClose} tabIndex={0}></div>
    </div>
  );
}

export default SelcetModal;
