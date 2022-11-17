import FormModal, { ModalContents } from './FormModal';

interface CreateSuccessModalProps {
  modalContents: ModalContents;
  code: string;
  onClose: () => void;
}

function CreateSuccessModal({
  modalContents,
  code,
  onClose,
}: CreateSuccessModalProps) {
  const onSubmit = () => {
    onClose();
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
