import { BiCopy } from '@react-icons/all-files/bi/BiCopy';
import cx from 'classnames';
import { useState, useEffect } from 'react';
import { MENU, MODAL_MENUS } from 'src/constants/workspace';

import Button from '../common/Button';
import Modal from '../common/Modal';
import style from './style.module.scss';

interface WorkspaceModalProps {
  selectedMenu: number;
  setSelectedMenu: React.Dispatch<React.SetStateAction<number | null>>;
}

function WorkspaceModal({
  selectedMenu,
  setSelectedMenu,
}: WorkspaceModalProps) {
  const [inputValue, setInputValue] = useState('');

  const { title, texts, btnText } = MODAL_MENUS[selectedMenu];
  const isCreatedModal = selectedMenu === MENU.CREATED_ID;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = () => {
    if (selectedMenu === MENU.CREATE_ID) {
      // 생성 완료 후 로직
      setSelectedMenu(MENU.CREATED_ID);
      setInputValue('WAB123456'); // TODO: 받아온 참여코드 넣어줄 것
    } else if (selectedMenu === MENU.JOIN_ID) {
      // 참여 완료 후 로직
    }
  };

  useEffect(() => {
    if (selectedMenu !== MENU.CREATED_ID) setInputValue('');
  }, [selectedMenu]);

  return (
    <Modal title={title} onClose={() => setSelectedMenu(null)}>
      <>
        {texts.map((text) => (
          <p key={text} className={style.text}>
            {text}
          </p>
        ))}

        <div className={style['input-section']}>
          {isCreatedModal && <BiCopy className={style['copy-icon']} />}
          <input
            className={cx(style.input, { [style.disabled]: isCreatedModal })}
            type="text"
            value={inputValue}
            onChange={onChange}
            disabled={isCreatedModal}
          />
        </div>

        <Button
          text={btnText}
          isDisabled={!inputValue.length}
          onClick={onSubmit}
        />
      </>
    </Modal>
  );
}

export default WorkspaceModal;
