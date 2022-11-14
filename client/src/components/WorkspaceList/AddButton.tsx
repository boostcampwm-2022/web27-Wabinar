import { MdAdd } from "@react-icons/all-files/md/MdAdd";
import React from "react";

import style from "./style.module.scss";

function AddButton() {
  return (
    <div className={style.button}>
      <MdAdd color="white" size={15} />
    </div>
  );
}

export default AddButton;
