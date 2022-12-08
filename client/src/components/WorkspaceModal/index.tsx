import { useState } from 'react';
import { MENU, MODAL_MENUS } from 'src/constants/workspace';
import { Workspace } from 'src/types/workspace';

import CreateModal from './CreateModal';
import CreateSuccessModal from './CreateSuccessModal';
import JoinModal from './JoinModal';

interface WorkspaceModalProps {
  selectedMenu: number;
  setSelectedMenu: React.Dispatch<React.SetStateAction<number>>;
}

function WorkspaceModal({
  selectedMenu,
  setSelectedMenu,
}: WorkspaceModalProps) {
  const [workspace, setWorkspace] = useState<Workspace>();

  const modalContents = MODAL_MENUS[selectedMenu];

  const onClose = () => setSelectedMenu(0);

  switch (selectedMenu) {
    case MENU.CREATE:
      return (
        <CreateModal
          modalContents={modalContents}
          onClose={onClose}
          setSelectedMenu={setSelectedMenu}
          setWorkspace={setWorkspace}
        />
      );
    case MENU.CREATE_SUCCESS:
      return (
        <CreateSuccessModal
          modalContents={modalContents}
          onClose={onClose}
          workspace={workspace}
        />
      );
    case MENU.JOIN:
      return <JoinModal modalContents={modalContents} onClose={onClose} />;
    default:
      return <></>;
  }
}

export default WorkspaceModal;
