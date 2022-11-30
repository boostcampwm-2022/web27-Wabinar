import { createContext } from 'react';
import { TMom } from 'src/types/mom';

interface IMomContext {
  mom: TMom;
  setMom: React.Dispatch<React.SetStateAction<TMom>>;
}

export const MomContext = createContext<IMomContext | null>(null);
