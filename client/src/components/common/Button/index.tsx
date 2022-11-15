import cx from "classnames";

import style from "./style.module.scss";

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  className?: string;
}

function Button({ text, icon, className }: ButtonProps) {
  return (
    <div className={cx(style.button, className)}>
      {icon}
      <button>{text}</button>
    </div>
  );
}

export default Button;
