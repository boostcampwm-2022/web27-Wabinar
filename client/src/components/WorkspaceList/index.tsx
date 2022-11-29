import Selector from 'common/Selector';
import WorkspaceModal from 'components/WorkspaceModal';
import WorkspaceThumbnaliList from 'components/WorkspaceThumbnailList';
import { memo, useEffect, useState } from 'react';
import { MENUS } from 'src/constants/workspace';
import WorkspaceContext from 'src/contexts/workspaces';
import { useUserContext } from 'src/hooks/useUserContext';
import { SelectorStyle } from 'src/types/selector';
import { Workspace } from 'src/types/workspace';

import AddButton from './AddButton';
import style from './style.module.scss';

function WorkspaceList() {
  const userContext = useUserContext();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    if (!userContext.userInfo) {
      return;
    }
    setWorkspaces(userContext.userInfo.workspaces);
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
    <WorkspaceContext.Provider value={{ setWorkspaces }}>
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
    </WorkspaceContext.Provider>
  );
}

export default memo(WorkspaceList);
