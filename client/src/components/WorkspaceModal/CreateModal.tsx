import React, { useState } from 'react';
import { postWorkspace } from 'src/apis/workspace';
import { MENU } from 'src/constants/workspace';

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
  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit = async () => {
    const { code } = await postWorkspace({ name: inputValue });
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
