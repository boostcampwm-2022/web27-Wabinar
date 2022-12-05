import { BsQuestionCircleFill } from '@react-icons/all-files/bs/BsQuestionCircleFill';
import React, { useState } from 'react';

import Message from './GuideMessage';
import style from './style.module.scss';

interface GuideIconProps {
  children: React.ReactNode;
}

function GuideIcon({ children }: GuideIconProps) {
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

export default GuideIcon;
