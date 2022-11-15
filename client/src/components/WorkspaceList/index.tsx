import { memo } from 'react';

import AddButton from './AddButton';
import style from './style.module.scss';
import WorkspaceThumbnaliList from './WorkspaceThumbnailList';

interface WorkspaceListProps {
  onSelectModalOpen: () => void;
}

function WorkspaceList({ onSelectModalOpen }: WorkspaceListProps) {
  return (
    <div className={style.workspace__container}>
      <WorkspaceThumbnaliList />
      <AddButton onClick={onSelectModalOpen} />
    </div>
  );
}

export default memo(WorkspaceList);
