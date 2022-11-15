import cx from 'classnames';

import style from './style.module.scss';

interface ButtonProps {
  text: string;
  href?: string;
  icon?: JSX.Element;
  className?: string;
}

function Button({ href, text, icon, className }: ButtonProps) {
  return href ? (
    <a href={href} className={cx(style.button, className)}>
      {icon}
      <span>{text}</span>
    </a>
  ) : (
    <button className={cx(style.button, className)}>
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default Button;
