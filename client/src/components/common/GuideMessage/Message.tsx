import React from 'react';

import style from './style.module.scss';

interface MessageProps {
  children: React.ReactNode;
}

function Message({ children }: MessageProps) {
  return <div className={style['text-container']}>{children}</div>;
}

export default Message;
