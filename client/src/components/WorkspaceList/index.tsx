import { memo, useContext, useEffect, useState } from 'react';
import { getWorkspaces } from 'src/apis/user';
import SelectModal from 'src/components/SelectModal';
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

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

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

  const onMenuSelection = (id: number) => {
    setIsOpen(false);
    setSelectedMenu(id);
  };

  return (
    <>
      <div className={style.workspace__container}>
        <WorkspaceThumbnaliList workspaces={workspaces} />
        <AddButton onClick={() => setIsOpen(true)} />

        {isOpen && (
          <SelectModal
            className={style['select-modal']}
            onClose={() => {
              console.log('on close');
              setIsOpen(false);
            }}
          >
            <ul className={style['menu-list']}>
              {MENUS.map(({ id, text }) => (
                <li
                  key={id}
                  onClick={() => {
                    console.log(id);
                    onMenuSelection(id);
                  }}
                >
                  {text}
                </li>
              ))}
            </ul>
          </SelectModal>
        )}
      </div>

      {selectedMenu && (
        <WorkspaceModal
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      )}
    </>
  );
}

export default memo(WorkspaceList);
