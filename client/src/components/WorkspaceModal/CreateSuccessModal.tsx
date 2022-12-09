import { useNavigate } from 'react-router-dom';
import ERROR_MESSAGE from 'src/constants/error-message';
import { Workspace } from 'src/types/workspace';

import FormModal, { ModalContents } from './FormModal';

interface CreateSuccessModalProps {
  modalContents: ModalContents;
  workspace?: Workspace;
  onClose: () => void;
}

function CreateSuccessModal({
  modalContents,
  workspace,
  onClose,
}: CreateSuccessModalProps) {
  const navigate = useNavigate();

  if (!workspace) {
    throw new Error(ERROR_MESSAGE.IMPOSSIBLE_HAPPENED);
  }

  const { id, code } = workspace;

  const onSubmit = () => {
    onClose();
    navigate(`/workspace/${id}`);
    return;
  };

  return (
    <FormModal
      {...modalContents}
      onClose={onClose}
      onSubmit={onSubmit}
      isDisabled
      inputValue={code}
    />
  );
}

export default CreateSuccessModal;
