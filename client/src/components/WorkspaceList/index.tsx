import { Workspace } from '@wabinar/types/workspace';
import Selector from 'common/Selector';
import WorkspaceModal from 'components/WorkspaceModal';
import WorkspaceThumbnaliList from 'components/WorkspaceThumbnailList';
import { memo, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import { MENUS } from 'src/constants/workspace';
import SetWorkspacesContext from 'src/contexts/set-workspaces';
import { useUserContext } from 'src/hooks/useUserContext';
import { SelectorStyle } from 'src/types/selector';

import AddButton from './AddButton';
import style from './style.module.scss';

function WorkspaceList() {
  const userContext = useUserContext();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const updateWorkspaces = async (userId: number) => {
    const { workspaces } = await getWorkspaces({ id: userId });
    setWorkspaces(workspaces);
  };

  useEffect(() => {
    if (!userContext.user) {
      return;
    }

    updateWorkspaces(userContext.user.id);
  }, []);

  const [selectedMenu, setSelectedMenu] = useState<number>(0);

  const onSelectMenu = (id: number) => {
    setSelectedMenu(id);
  };

  const selectorStyle: SelectorStyle = {
    menu: style.menu,
    dimmed: style.dimmed,
  };

  return (
    <SetWorkspacesContext.Provider value={setWorkspaces}>
      <div className={style['workspace-list-container']}>
        <WorkspaceThumbnaliList workspaces={workspaces} />
        <Selector
          TriggerElement={AddButton}
          options={MENUS}
          onChange={onSelectMenu}
          style={selectorStyle}
        />
        <WorkspaceModal
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
    </SetWorkspacesContext.Provider>
  );
}

export default memo(WorkspaceList);
