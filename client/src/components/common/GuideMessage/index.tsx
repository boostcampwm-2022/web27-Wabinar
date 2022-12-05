import { BsQuestionCircleFill } from '@react-icons/all-files/bs/BsQuestionCircleFill';
import React, { useState } from 'react';

import Message from './Message';
import style from './style.module.scss';

interface GuideMessageProps {
  children: React.ReactNode;
}

function GuideMessage({ children }: GuideMessageProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={style['information-container']}>
      <BsQuestionCircleFill
        className={style['question-icon']}
        onClick={onToggle}
      />
      {isOpen && <Message>{children}</Message>}
    </div>
  );
}

export default GuideMessage;
