import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import ConfContext from 'src/contexts/conf';

export function useConfContext() {
  const context = useContext(ConfContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
