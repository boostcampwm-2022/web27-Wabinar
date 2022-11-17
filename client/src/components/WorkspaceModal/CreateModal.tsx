import { useState } from 'react';

import FormModal, { ModalContents } from './FormModal';

interface CreateModalProps {
  modalContents: ModalContents;
  onClose: () => void;
  setSelectedMenu: React.Dispatch<React.SetStateAction<number>>;
}

function CreateModal({
  modalContents,
  onClose,
  setSelectedMenu,
}: CreateModalProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit = () => {
    setSelectedMenu(3);
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
