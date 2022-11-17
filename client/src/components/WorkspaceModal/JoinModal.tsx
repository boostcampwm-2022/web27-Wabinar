import { useState } from 'react';
import { postWorkspaceJoin } from 'src/apis/workspace';
import { useSetWorkspaces } from 'src/hooks/useSetWorkspaces';

import FormModal, { ModalContents } from './FormModal';

interface JoinModalProps {
  modalContents: ModalContents;
  onClose: () => void;
}

function JoinModal({ modalContents, onClose }: JoinModalProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const setWorkspaces = useSetWorkspaces();

  const onSubmit = async () => {
    try {
      const workspace = await postWorkspaceJoin({ code: inputValue });

      setWorkspaces((prev) => {
        return [...prev, workspace];
      });

      onClose();
    } catch (e) {
      console.log('에러 메세지 표시');
    }
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
