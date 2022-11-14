import React from "react";
import style from "./style.module.scss";

interface WorkspaceThumbnailItemProps {
  name: string;
  imageUrl?: string;
}

/**
 * API 연동할 때 변경해줘야 해요.
 */
function WorkspaceThumbnailItem({ name }: WorkspaceThumbnailItemProps) {
  return (
    <li className={style.thumbnail}>
      <div className={style.thumbnail__content}>
        {/* <img src={imageUrl} /> */}
        {name[0]}
      </div>
    </li>
  );
}

export default WorkspaceThumbnailItem;
