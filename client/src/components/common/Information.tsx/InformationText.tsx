import React from 'react';

import style from './style.module.scss';

interface InformationTextProps {
  children: React.ReactNode;
}

function InformationText({ children }: InformationTextProps) {
  return <div className={style['text-container']}>{children}</div>;
}

export default InformationText;
