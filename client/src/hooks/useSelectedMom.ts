import { useContext } from 'react';
import { SelectedMomContext } from 'src/contexts/selected-mom';

export default function useMom() {
  const context = useContext(SelectedMomContext);

  if (!context) throw new Error('아니요. 없어요.');

  return context;
}
