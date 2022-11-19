import WorkspaceList from 'components/WorkspaceList';
import Sidebar from 'src/components/Sidebar';

import style from './style.module.scss';

function WorkspacePage() {
  return (
    <div className={style.container}>
      <WorkspaceList />
      <Sidebar />
    </div>
  );
}

export default WorkspacePage;
