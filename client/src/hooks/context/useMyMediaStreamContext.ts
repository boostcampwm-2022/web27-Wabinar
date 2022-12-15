import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import { MyMediaStreamContext } from 'src/contexts/rtc';

export default function useMyMediaStreamContext() {
  const context = useContext(MyMediaStreamContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
