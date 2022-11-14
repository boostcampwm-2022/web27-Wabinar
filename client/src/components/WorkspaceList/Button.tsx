import React from "react";
import PlusIcon from "/plus.png";
import style from "./style.module.scss";

function Button() {
  return (
    <div className={style.button}>
      <img className={style.button__add} src={PlusIcon} />
    </div>
  );
}

export default Button;
