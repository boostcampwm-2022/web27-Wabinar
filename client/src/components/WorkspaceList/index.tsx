import React from "react";
import WorkspaceThumbnaliList from "./WorkspaceThumbnaliList";
import 스타일 from "./style.module.scss";
import Button from "./Button";

function WorkspaceList() {
  return (
    <div className={스타일.워크스페이스_컨테이너}>
      <WorkspaceThumbnaliList />
      <Button />
    </div>
  );
}

export default WorkspaceList;
