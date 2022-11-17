import Selector from 'common/Selector';
import { SelectorStyle } from 'common/Selector/types';
import WorkspaceModal from 'components/WorkspaceModal';
import WorkspaceThumbnaliList from 'components/WorkspaceThumbnailList';
import { memo, useContext, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import { MENUS } from 'src/constants/workspace';
import UserContext from 'src/contexts/user';
import { Workspace } from 'src/types/workspace';

import AddButton from './AddButton';
import style from './style.module.scss';

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

  const selectorStyle: SelectorStyle = {
    menu: style.menu,
    dimmed: style.dimmed,
  };

  return (
    <>
      <div className={style.workspace__container}>
        <WorkspaceThumbnaliList workspaces={workspaces} />
        <Selector
          TriggerElement={AddButton}
          options={MENUS}
          onChange={onSelectMenu}
          style={selectorStyle}
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
