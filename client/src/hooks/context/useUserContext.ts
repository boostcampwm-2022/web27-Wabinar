import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import UserContext from 'src/contexts/user';

export default function useUserContext() {
  const context = useContext(UserContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
