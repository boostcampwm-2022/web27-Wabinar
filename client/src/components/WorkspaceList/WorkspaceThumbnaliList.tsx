import React from "react";
import style from "./style.module.scss";

const workspaces = [
  { id: 1, name: "왭" },
  { id: 2, name: "네이버" },
  { id: 3, name: "카카오" },
  { id: 4, name: "토스" },
];

function WorkspaceThumbnaliList() {
  return (
    <ul className={style.thumbnail__list}>
      {workspaces.map((workspace) => (
        <li key={workspace.id} className={style.thumbnail}>
          <div className={style.thumbnail__content}>{workspace.name[0]}</div>
        </li>
      ))}
    </ul>
  );
}

export default WorkspaceThumbnaliList;
