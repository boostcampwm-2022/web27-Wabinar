import Workspace from 'components/Workspace';
import WorkspaceList from 'components/WorkspaceList';
import { useParams } from 'react-router-dom';
import ConfMediaBar from 'src/components/ConfMediaBar';

import style from './style.module.scss';

function WorkspacePage() {
  const { id } = useParams();

  return (
    <div className={style.container}>
      <WorkspaceList />
      <Workspace workspaceId={id} />
      <ConfMediaBar workspaceId={id} />
    </div>
  );
}

export default WorkspacePage;
