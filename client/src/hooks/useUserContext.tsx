import { useContext } from 'react';
import UserContext from 'src/contexts/user';
import { User } from 'src/types/user';

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context)
    throw new Error('UserContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
