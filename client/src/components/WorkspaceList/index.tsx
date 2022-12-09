import WorkspaceModalSelector from 'common/Selector';
import WorkspaceModal from 'components/WorkspaceModal';
import WorkspaceThumbnaliList from 'components/WorkspaceThumbnailList';
import { memo, useState } from 'react';
import { MENUS } from 'src/constants/workspace';
import useWorkspacesContext from 'src/hooks/useWorkspacesContext';
import { SelectorStyle } from 'src/types/selector';

import AddButton from './AddButton';
import style from './style.module.scss';

function WorkspaceList() {
  const { workspaces } = useWorkspacesContext();

  const [selectedMenu, setSelectedMenu] = useState<number>(0);

  const onSelectMenu = (id: number) => {
    setSelectedMenu(id);
  };

  const selectorStyle: SelectorStyle = {
    menu: style.menu,
    dimmed: style.dimmed,
  };

  return (
    <div className={style['workspace-list-container']}>
      <WorkspaceThumbnaliList workspaces={workspaces} />
      <WorkspaceModalSelector
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
  );
}

export default memo(WorkspaceList);
