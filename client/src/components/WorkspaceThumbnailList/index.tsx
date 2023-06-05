import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { workspaceState } from 'src/store/atom/workspace';
import { Workspace } from 'src/types/workspace';

import style from './style.module.scss';
import WorkspaceThumbnailItem from './WorkspaceThumbnailItem';

interface WorkspaceThumbnailListProps {
  workspaces: Workspace[];
}

function WorkspaceThumbnailList({ workspaces }: WorkspaceThumbnailListProps) {
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  const [, setWorkspace] = useRecoilState(workspaceState);

  const onClick = (targetId: number) => {
    if (Number(currentId) === targetId) return;

    setWorkspace(null);
    navigate(`/workspace/${targetId}`);
  };

  return (
    <ul className={style.thumbnail__list}>
      {workspaces.map(({ id, name }) => (
        <WorkspaceThumbnailItem
          key={id}
          name={name}
          onClick={() => onClick(id)}
        />
      ))}
    </ul>
  );
}

export default WorkspaceThumbnailList;
