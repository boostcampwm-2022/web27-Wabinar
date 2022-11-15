import { memo } from 'react';

import AddButton from './AddButton';
import style from './style.module.scss';
import WorkspaceThumbnaliList from './WorkspaceThumbnailList';

function WorkspaceList() {
  return (
    <div className={style.workspace__container}>
      <WorkspaceThumbnaliList />
      <AddButton />
    </div>
  );
}

export default memo(WorkspaceList);
