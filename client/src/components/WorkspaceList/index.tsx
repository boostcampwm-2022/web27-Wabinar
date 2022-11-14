import React from "react";
import WorkspaceThumbnaliList from "./WorkspaceThumbnailList";
import style from "./style.module.scss";
import AddButton from "./AddButton";

function WorkspaceList() {
  return (
    <div className={style.workspace__container}>
      <WorkspaceThumbnaliList />
      <AddButton />
    </div>
  );
}

export default WorkspaceList;
