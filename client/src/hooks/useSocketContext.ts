import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import { SocketContext } from 'src/contexts/socket';

export default function useSocketContext() {
  const context = useContext(SocketContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
