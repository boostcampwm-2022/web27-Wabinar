// eslint-disable-next-line import/named
import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postWorkspaceJoin } from 'src/apis/workspace';
import useWorkspacesContext from 'src/hooks/context/useWorkspacesContext';

import FormModal, { ModalContents } from './FormModal';

interface JoinModalProps {
  modalContents: ModalContents;
  onClose: () => void;
}

function JoinModal({ modalContents, onClose }: JoinModalProps) {
  const navigate = useNavigate();
  const { setWorkspaces } = useWorkspacesContext();

  const [inputValue, setInputValue] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const onSubmit = async () => {
    try {
      const workspace = await postWorkspaceJoin({ code: inputValue });

      setWorkspaces((prev) => {
        return [...prev, workspace];
      });

      onClose();
      navigate(`/workspace/${workspace.id}`);
    } catch (e) {
      const { data } = (e as AxiosError).response as AxiosResponse;

      setErrorMessage(data?.message ?? '다시 시도해주세요 ^^');
    }
  };

  return (
    <FormModal
      {...modalContents}
      onClose={onClose}
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      errorMessage={errorMessage}
    />
  );
}

export default JoinModal;
