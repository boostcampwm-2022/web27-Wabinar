import { MdSettings } from '@react-icons/all-files/md/MdSettings';
import WorkspaceSettingModal from 'components/WorkspaceSettingModal';
import { useState } from 'react';

function SettingIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MdSettings size={15} onClick={onOpen} style={{ cursor: 'pointer' }} />
      {isOpen && (
        <WorkspaceSettingModal title="워크스페이스 설정" onClose={onClose} />
      )}
    </>
  );
}

export default SettingIcon;
