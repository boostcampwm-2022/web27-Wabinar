import WorkspaceList from 'src/components/WorkspaceList';

import style from './style.module.scss';

function WorkspacePage() {
  return (
    <div className={style.container}>
      <WorkspaceList />
    </div>
  );
}

export default WorkspacePage;
