import Selector from 'components/common/Selector';
import { memo, useContext, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import WorkspaceModal from 'src/components/WorkspaceModal';
import { MENUS } from 'src/constants/workspace';
import UserContext from 'src/contexts/user';
import { Workspace } from 'src/types/workspace';

import AddButton from './AddButton';
import style from './style.module.scss';
import WorkspaceThumbnaliList from './WorkspaceThumbnailList';

function WorkspaceList() {
  const userContext = useContext(UserContext);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

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

  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  const onSelectMenu = (id: number) => {
    setSelectedMenu(id);
  };

  return (
    <>
      <div className={style.workspace__container}>
        <WorkspaceThumbnaliList workspaces={workspaces} />
        <Selector
          trigger={<AddButton />}
          options={MENUS}
          onChange={onSelectMenu}
        />
        {selectedMenu && (
          <WorkspaceModal
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}
      </div>
    </>
  );
}

export default memo(WorkspaceList);
