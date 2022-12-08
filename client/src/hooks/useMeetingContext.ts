import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import MeetingContext from 'src/contexts/meeting';

export function useMeetingContext() {
  const context = useContext(MeetingContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
