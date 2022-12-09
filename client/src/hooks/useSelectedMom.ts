import { useContext } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import { SelectedMomContext } from 'src/contexts/selected-mom';

export default function useSelectedMom() {
  const context = useContext(SelectedMomContext);

  if (!context) throw new Error(ERROR_MESSAGE.OUT_OF_CONTEXT_SCOPE);

  return context;
}
