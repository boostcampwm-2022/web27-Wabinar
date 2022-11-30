import { useContext } from 'react';
import { MomContext } from 'src/contexts/mom';

export default function useMom() {
  const context = useContext(MomContext);

  if (!context) throw new Error('');

  return context;
}
