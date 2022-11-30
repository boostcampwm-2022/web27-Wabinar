import { BiCodeBlock } from '@react-icons/all-files/bi/BiCodeBlock';
import Button from 'src/components/common/Button';
import CopyButton from 'src/components/common/CopyButton';
import Modal from 'src/components/common/Modal';

import style from './style.module.scss';

interface WorkspaceSettingModalProps {
  title: string;
  onClose: () => void;
}

function WorkspaceSettingModal({ title, onClose }: WorkspaceSettingModalProps) {
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
          <CopyButton className={style['copy-icon']} target={code} />
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

export default WorkspaceSettingModal;
