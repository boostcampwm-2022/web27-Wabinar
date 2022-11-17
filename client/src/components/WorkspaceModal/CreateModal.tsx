import React, { useState } from 'react';
import { postWorkspace, postWorkspaceJoin } from 'src/apis/workspace';
import { MENU } from 'src/constants/workspace';
import { useSetWorkspaces } from 'src/hooks/useSetWorkspaces';
import { useUserContext } from 'src/hooks/useUserContext';

import FormModal, { ModalContents } from './FormModal';

interface CreateModalProps {
  modalContents: ModalContents;
  onClose: () => void;
  setSelectedMenu: React.Dispatch<React.SetStateAction<number>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

function CreateModal({
  modalContents,
  onClose,
  setSelectedMenu,
  setCode,
}: CreateModalProps) {
  const setWorkspaces = useSetWorkspaces();
  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit = async () => {
    const { workspace } = await postWorkspace({ name: inputValue });
    const { code } = workspace;

    await postWorkspaceJoin({ code });

    setWorkspaces((workspaces) => [...workspaces, workspace]);
    setCode(code);
    setSelectedMenu(MENU.CREATE_SUCCESS);

    return;
  };

  return (
    <FormModal
      {...modalContents}
      onClose={onClose}
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
    />
  );
}

export default CreateModal;
