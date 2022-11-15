import classNames from 'classnames/bind';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  className?: string;
  isDisable?: boolean;
  color?: string;
}

function Button({
  text,
  icon,
  className,
  isDisable = false,
  color,
}: ButtonProps) {
  return (
    <div
      className={cx(style.button, className, { disable: isDisable })}
      style={{ backgroundColor: color }}
    >
      {icon}
      <button disabled={isDisable}>{text}</button>
    </div>
  );
}

export default Button;
