import { BiCodeBlock } from '@react-icons/all-files/bi/BiCodeBlock';
import { BiCopy } from '@react-icons/all-files/bi/BiCopy';
import React from 'react';

import Button from '../common/Button';
import Modal from '../common/Modal';
import style from './style.module.scss';

interface SettingModalProps {
  title: string;
  onClose: () => void;
}

function SettingModal({ title, onClose }: SettingModalProps) {
  const code = '1234';

  const onClick = () => {
    onClose();
    return;
  };

  return (
    <Modal title={title} isDark={true} onClose={onClose}>
      <>
        <label className={style['input-label']}>
          <BiCodeBlock className={style['code-block-icon']} />
          <span className={style['label-title']}>참여코드</span>
        </label>
        <div className={style['input-section']}>
          <BiCopy className={style['copy-icon']} />
          <input
            className={style.input}
            type="text"
            value={code}
            disabled={true}
          />
        </div>
        <Button
          className={style.button}
          text="워크스페이스 탈퇴"
          onClick={onClick}
        ></Button>
      </>
    </Modal>
  );
}

export default SettingModal;
