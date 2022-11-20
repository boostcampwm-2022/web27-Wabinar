import { Workspace } from '@wabinar/types/workspace';

import style from './style.module.scss';
import WorkspaceThumbnailItem from './WorkspaceThumbnailItem';

interface WorkspaceThumbnailListProps {
  workspaces: Workspace[];
}

function WorkspaceThumbnailList({ workspaces }: WorkspaceThumbnailListProps) {
  return (
    <ul className={style.thumbnail__list}>
      {workspaces.map((workspace) => (
        <WorkspaceThumbnailItem key={workspace.id} name={workspace.name} />
      ))}
    </ul>
  );
}

export default WorkspaceThumbnailList;
