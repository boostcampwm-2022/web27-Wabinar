import { useContext } from 'react';
import MomContext from 'src/contexts/mom';

export function useMomContext() {
  const context = useContext(MomContext);

  if (!context)
    throw new Error('MomContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
