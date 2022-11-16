import { memo, useContext, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import WorkspaceSelectModal from 'src/components/WorkspaceList/WorkspaceSelectModal';
import UserContext from 'src/contexts/user';
import { Workspace } from 'src/types/workspace';

import AddButton from './AddButton';
import style from './style.module.scss';
import WorkspaceThumbnaliList from './WorkspaceThumbnailList';

function WorkspaceList() {
  const userContext = useContext(UserContext);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateWorkspaces = async (userId: number) => {
    const { workspaces } = await getWorkspaces({ id: userId });
    setWorkspaces(workspaces);
  };

  useEffect(() => {
    if (!userContext) {
      return;
    }

    updateWorkspaces(userContext.user.id);
  }, []);

  return (
    <>
      <div className={style.workspace__container}>
        <WorkspaceThumbnaliList workspaces={workspaces} />
        <AddButton onClick={() => setIsOpen(true)} />

        <WorkspaceSelectModal
          className={style['select-modal']}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
}

export default memo(WorkspaceList);
