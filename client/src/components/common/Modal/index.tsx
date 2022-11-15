import Portal from "src/components/Portal";
import style from "./style.module.scss";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import cx from "classnames";

interface ModalProps {
  title?: string;
  isHaveCloseBtn?: boolean;
  children: JSX.Element;
  className?: string;
}

function Modal({
  title,
  isHaveCloseBtn = true,
  children,
  className,
}: ModalProps) {
  const onClickDimmer = () => {};

  return (
    <Portal>
      <div
        className={style.modal}
        role="alertdialog"
        aria-modal
        aria-labelledby="modal"
      >
        <div className={cx(style.container, className)}>
          {(title || isHaveCloseBtn) && (
            <div className={style.header}>
              {title && <h2>{title}</h2>}
              {isHaveCloseBtn && (
                <span>
                  <MdClose />
                </span>
              )}
            </div>
          )}

          {children}
        </div>
        <div
          className={style.dimmer}
          onClick={onClickDimmer}
          tabIndex={0}
        ></div>
      </div>
    </Portal>
  );
}

export default Modal;
