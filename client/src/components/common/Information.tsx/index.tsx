import { BsQuestionCircleFill } from '@react-icons/all-files/bs/BsQuestionCircleFill';
import React, { useState } from 'react';

import InformationText from './InformationText';
import style from './style.module.scss';

interface InformationProps {
  children: React.ReactNode;
}

function Information({ children }: InformationProps) {
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
      {isOpen && <InformationText>{children}</InformationText>}
    </div>
  );
}

export default Information;
