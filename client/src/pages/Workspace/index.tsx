import { useState } from 'react';
import SelcetModal from 'src/components/SelectModal';
import WorkspaceList from 'src/components/WorkspaceList';
import WorkspaceModal from 'src/components/WorkspaceModal';
import { MENUS, MODAL_MENUS } from 'src/constants/workspace';

import style from './style.module.scss';

function WorkspacePage() {
  const [clickedMenuId, setClickedMenuId] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const onInput = (value: string) => {
    setInputValue(value);
  };

  const onClickMenu = (id: number) => {
    setClickedMenuId(id);
  };

  return (
    <div className={style.container}>
      <WorkspaceList />
      <SelcetModal className={style['select-modal']}>
        <ul className={style['menu-list']}>
          {MENUS.map(({ id, text }) => (
            <li key={id} onClick={() => onClickMenu(id)}>
              {text}
            </li>
          ))}
        </ul>
      </SelcetModal>

      {MODAL_MENUS.map(({ id, props: { title, text, btnText } }) => {
        if (id === clickedMenuId)
          return (
            <WorkspaceModal
              key={id}
              {...{ title, text, btnText }}
              inputValue={inputValue}
              onChange={onInput}
            />
          );
      })}
    </div>
  );
}

export default WorkspacePage;
