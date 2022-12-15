import MomSkeleton from 'src/components/Mom/Skeleton';
import SideBarSkeleton from 'src/components/Sidebar/Skeleton';
import WorkspaceListSkeleton from 'src/components/WorkspaceList/Skeleton';

import style from './style.module.scss';

function WorkspaceSkeleton() {
  return (
    <div className={style['workspace-sk']}>
      <WorkspaceListSkeleton />
      <SideBarSkeleton />
      <MomSkeleton />
    </div>
  );
}

export default WorkspaceSkeleton;
