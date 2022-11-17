import FormModal, { ModalContents } from './FormModal';

interface JoinModalProps {
  modalContents: ModalContents;
  onClose: () => void;
}

function JoinModal({ modalContents, onClose }: JoinModalProps) {
  const onSubmit = () => {
    return;
  };

  return <FormModal {...modalContents} onClose={onClose} onSubmit={onSubmit} />;
}

export default JoinModal;
