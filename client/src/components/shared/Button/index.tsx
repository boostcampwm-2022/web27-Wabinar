import $ from "./style.module.scss";

interface ButtonProps {
  text: string;
  icon: JSX.Element;
}

function Button({ text, icon }: ButtonProps) {
  return (
    <div className={$.button}>
      {icon}
      <button>{text}</button>
    </div>
  );
}

export default Button;
