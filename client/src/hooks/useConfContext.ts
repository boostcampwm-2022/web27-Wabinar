import { useContext } from 'react';
import ConfContext from 'src/contexts/conf';

export function useConfContext() {
  const context = useContext(ConfContext);

  if (!context)
    throw new Error('ConfContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
