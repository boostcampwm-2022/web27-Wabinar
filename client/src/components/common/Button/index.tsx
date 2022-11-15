import classNames from 'classnames/bind';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  className?: string;
  isDisable?: boolean;
  color?: string;
  onClick?: () => void;
}

function Button({
  text,
  icon,
  className,
  isDisable = false,
  color,
  onClick,
}: ButtonProps) {
  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className={cx(style.button, className, { disable: isDisable })}
      style={{ backgroundColor: color }}
    >
      {icon}
      <button disabled={isDisable} onClick={onClickBtn}>
        {text}
      </button>
    </div>
  );
}

export default Button;
