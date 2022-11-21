import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';

import style from './style.module.scss';

function WorkspacePage() {
  return (
    <div className={style.container}>
      <WorkspaceList />
      <Workspace />
    </div>
  );
}

export default WorkspacePage;
