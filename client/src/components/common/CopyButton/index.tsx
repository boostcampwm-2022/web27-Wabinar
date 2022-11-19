import { BiCopy } from '@react-icons/all-files/bi/BiCopy';
import React from 'react';

interface CopyButton {
  target: string;
  className?: string;
}

function CopyButton({ target, className }: CopyButton) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(target);
      alert('참여 코드가 복사되었습니다.');
    } catch (e) {
      alert('실패');
    }
  };

  return <BiCopy className={className} onClick={onCopy} />;
}

export default CopyButton;
