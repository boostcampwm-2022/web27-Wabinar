import React, { useState } from 'react';
import { postWorkspace, postWorkspaceJoin } from 'src/apis/workspace';
import { MENU } from 'src/constants/workspace';
import useWorkspacesContext from 'src/hooks/context/useWorkspacesContext';
import { Workspace } from 'src/types/workspace';

import FormModal, { ModalContents } from './FormModal';

interface CreateModalProps {
  modalContents: ModalContents;
  onClose: () => void;
  setSelectedMenu: React.Dispatch<React.SetStateAction<number>>;
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | undefined>>;
}

function CreateModal({
  modalContents,
  onClose,
  setSelectedMenu,
  setWorkspace,
}: CreateModalProps) {
  const { setWorkspaces } = useWorkspacesContext();

  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit = async () => {
    const workspace = await postWorkspace({ name: inputValue });
    const { code } = workspace;

    await postWorkspaceJoin({ code });

    setWorkspaces((workspaces) => [...workspaces, workspace]);
    setWorkspace(workspace);
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
