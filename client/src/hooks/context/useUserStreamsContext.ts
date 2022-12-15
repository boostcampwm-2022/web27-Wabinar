import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import { UserStreamsContext } from 'src/contexts/rtc';

export default function useUserStreamsContext() {
  const context = useContext(UserStreamsContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
