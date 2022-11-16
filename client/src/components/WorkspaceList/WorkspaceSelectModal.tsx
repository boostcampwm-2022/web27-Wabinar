import React, { useState } from 'react';
import SelectModal from 'src/components/SelectModal';
import WorkspaceModal from 'src/components/WorkspaceModal';
import { MENUS } from 'src/constants/workspace';

import style from './style.module.scss';

interface WorkspaceSelectModalProps {
  className: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function WorkspaceSelectModal({
  isOpen,
  setIsOpen,
}: WorkspaceSelectModalProps) {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  const onClose = () => setIsOpen(false);

  const onMenuSelection = (id: number) => () => {
    onClose();
    setSelectedMenu(id);
  };

  return (
    <>
      {isOpen && (
        <SelectModal onClose={onClose}>
          <ul className={style['menu-list']}>
            {MENUS.map(({ id, text }) => (
              <li key={id} onClick={onMenuSelection(id)}>
                {text}
              </li>
            ))}
          </ul>
        </SelectModal>
      )}
      {selectedMenu && (
        <WorkspaceModal
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      )}
    </>
  );
}

export default WorkspaceSelectModal;
