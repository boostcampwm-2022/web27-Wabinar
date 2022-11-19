import classNames from 'classnames/bind';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface ButtonProps {
  text: string;
  href?: string;
  icon?: JSX.Element;
  className?: string;
  isDisabled?: boolean;
  color?: string;
  onClick?: () => void;
}

function Button({
  text,
  href,
  icon,
  className,
  isDisabled = false,
  color,
  onClick,
}: ButtonProps) {
  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return href ? (
    <a href={href} className={cx(style.button, className)}>
      {icon}
      <span>{text}</span>
    </a>
  ) : (
    <button
      className={cx(style.button, className, { disable: isDisabled })}
      disabled={isDisabled}
      onClick={onClickBtn}
      style={{ backgroundColor: color }}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default Button;
