import { useContext } from 'react';
import MeetingContext from 'src/contexts/meeting';

export function useMeetingContext() {
  const context = useContext(MeetingContext);

  if (!context)
    throw new Error('ConfContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
