import $ from "./style.module.scss";
import cx from "classnames";

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  className?: string;
}

function Button({ text, icon, className }: ButtonProps) {
  return (
    <div className={cx($.button, className)}>
      {icon}
      <button>{text}</button>
    </div>
  );
}

export default Button;
