import { memo } from 'react';

import style from './style.module.scss';

interface WorkspaceThumbnailItemProps {
  name: string;
  imageUrl?: string;
  onClick: () => void;
}

/**
 * API 연동할 때 변경해줘야 해요.
 */
function WorkspaceThumbnailItem({
  name,
  onClick,
}: WorkspaceThumbnailItemProps) {
  return (
    <li
      className={style.thumbnail}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={style.thumbnail__content}>
        {/* <img src={imageUrl} /> */}
        {name[0]}
      </div>
    </li>
  );
}

export default memo(WorkspaceThumbnailItem);
