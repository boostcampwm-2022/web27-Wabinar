import { MdSettings } from '@react-icons/all-files/md/MdSettings';
import React, { useState } from 'react';

import SettingModal from './SettingModal';

function WorkspaceSetting() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MdSettings
        size={15}
        onClick={() => {
          setIsOpen(true);
        }}
      />
      {isOpen && <SettingModal title="워크스페이스 설정" onClose={onClose} />}
    </>
  );
}

export default WorkspaceSetting;
