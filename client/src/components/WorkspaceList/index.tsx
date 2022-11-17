import Selector from 'common/Selector';
import WorkspaceModal from 'components/WorkspaceModal';
import WorkspaceThumbnaliList from 'components/WorkspaceThumbnailList';
import { memo, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import { MENUS } from 'src/constants/workspace';
import { useUserContext } from 'src/hooks/useUserContext';
import { SelectorStyle } from 'src/types/selector';
import { Workspace } from 'src/types/workspace';

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
    <>
      <div className={style.workspace__container}>
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
    </>
  );
}

export default memo(WorkspaceList);
