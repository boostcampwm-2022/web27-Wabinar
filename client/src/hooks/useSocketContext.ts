import { useContext } from 'react';
import { SocketContext } from 'src/contexts/socket';

export default function useSocketContext() {
  const context = useContext(SocketContext);

  if (!context)
    throw new Error('SocketContext는 정의된 스코프 안에서만 사용 가능해요 ^^');

  return context;
}
