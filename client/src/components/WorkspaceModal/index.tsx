import { useState } from 'react';
import { MENU, MODAL_MENUS } from 'src/constants/workspace';

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
  const [code, setCode] = useState<string>('');

  const modalContents = MODAL_MENUS[selectedMenu];

  const onClose = () => setSelectedMenu(0);

  switch (selectedMenu) {
    case MENU.CREATE:
      return (
        <CreateModal
          modalContents={modalContents}
          onClose={onClose}
          setSelectedMenu={setSelectedMenu}
          setCode={setCode}
        />
      );
    case MENU.CREATE_SUCCESS:
      return (
        <CreateSuccessModal
          modalContents={modalContents}
          onClose={onClose}
          code={code}
        />
      );
    case MENU.JOIN:
      return <JoinModal modalContents={modalContents} onClose={onClose} />;
    default:
      return <></>;
  }
}

export default WorkspaceModal;
