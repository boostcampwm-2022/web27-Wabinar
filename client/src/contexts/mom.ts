import { createContext } from 'react';
import { TMom } from 'src/types/mom';

interface IMomContext {
  mom: TMom | null;
  setMom: React.Dispatch<React.SetStateAction<TMom | null>>;
}

export const MomContext = createContext<IMomContext | null>(null);
