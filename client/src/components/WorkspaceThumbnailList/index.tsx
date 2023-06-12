import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Workspace } from 'src/types/workspace';

import style from './style.module.scss';
import WorkspaceThumbnailItem from './WorkspaceThumbnailItem';

interface WorkspaceThumbnailListProps {
  workspaces: Workspace[];
}

function WorkspaceThumbnailList({ workspaces }: WorkspaceThumbnailListProps) {
  const queryClient = useQueryClient();

  const { id: currentId } = useParams();
  const navigate = useNavigate();

  const onClick = (targetId: number) => {
    if (Number(currentId) === targetId) return;

    queryClient.invalidateQueries({ queryKey: ['workspace', currentId] });
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
