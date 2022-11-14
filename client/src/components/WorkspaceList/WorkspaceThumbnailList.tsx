import React from "react";

import style from "./style.module.scss";
import WorkspaceThumbnailItem from "./WorkspaceThumbnailItem";

const workspaces = [
  { id: 1, name: "왭" },
  { id: 2, name: "네이버" },
  { id: 3, name: "카카오" },
  { id: 4, name: "토스" },
];

function WorkspaceThumbnailList() {
  return (
    <ul className={style.thumbnail__list}>
      {workspaces.map((workspace) => (
        <WorkspaceThumbnailItem key={workspace.id} name={workspace.name} />
      ))}
    </ul>
  );
}

export default WorkspaceThumbnailList;
