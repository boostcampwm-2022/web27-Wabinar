import { BiCodeBlock } from '@react-icons/all-files/bi/BiCodeBlock';
import { useParams } from 'react-router-dom';
import Button from 'src/components/common/Button';
import CopyButton from 'src/components/common/CopyButton';
import Modal from 'src/components/common/Modal';
import useWorkspacesContext from 'src/hooks/useWorkspacesContext';

import style from './style.module.scss';

interface WorkspaceSettingModalProps {
  title: string;
  onClose: () => void;
}

function WorkspaceSettingModal({ title, onClose }: WorkspaceSettingModalProps) {
  const { workspaces } = useWorkspacesContext();
  const { id } = useParams();

  const workspace = workspaces.find((workspace) => workspace.id === Number(id));

  if (!workspace) {
    throw new Error('일어날 수 없는 일이 일어났어요 ^^');
  }

  const { code } = workspace;

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
          <CopyButton className={style['copy-icon']} target={code} />
        </label>
        <div className={style['input-section']}>
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
