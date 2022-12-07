import { useNavigate } from 'react-router-dom';
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
    throw new Error('일어날 수 없는 일이 일어났어요 ^^');
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
