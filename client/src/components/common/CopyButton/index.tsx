import { BiCopy } from '@react-icons/all-files/bi/BiCopy';

interface CopyButtonProps {
  target: string;
  className?: string;
}

function CopyButton({ target, className }: CopyButtonProps) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(target);
      alert('참여 코드가 복사되었습니다.');
    } catch (e) {
      alert('실패');
    }
  };

  return (
    <button className={className} onClick={onCopy} aria-label="참여코드 복사">
      <BiCopy />
    </button>
  );
}

export default CopyButton;
