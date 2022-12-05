import React from 'react';

import style from './style.module.scss';

interface GuideMessageProps {
  children: React.ReactNode;
}

function GuideMessage({ children }: GuideMessageProps) {
  return <div className={style['text-container']}>{children}</div>;
}

export default GuideMessage;
