import React from "react";
import style from "./style.module.scss";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";

function AddButton() {
  return (
    <div className={style.button}>
      <MdAdd color="white" size={15} />
    </div>
  );
}

export default AddButton;
