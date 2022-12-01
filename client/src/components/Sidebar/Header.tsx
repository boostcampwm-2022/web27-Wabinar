import React, { memo } from 'react';

import SettingIcon from './SettingIcon';
import style from './style.module.scss';

interface HeaderProps {
  name: string;
}

function Header({ name }: HeaderProps) {
  return (
    <div className={style['header']}>
      <h1>{name}</h1>
      <SettingIcon />
    </div>
  );
}

export default memo(Header);
