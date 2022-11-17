import { useState } from 'react';

import FormModal, { ModalContents } from './FormModal';

interface JoinModalProps {
  modalContents: ModalContents;
  onClose: () => void;
}

function JoinModal({ modalContents, onClose }: JoinModalProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit = () => {
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

export default JoinModal;
