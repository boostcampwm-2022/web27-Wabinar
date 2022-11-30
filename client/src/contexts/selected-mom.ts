import { createContext } from 'react';
import { TMom } from 'src/types/mom';

interface IMomContext {
  selectedMom: TMom | null;
  setSelectedMom: React.Dispatch<React.SetStateAction<TMom | null>>;
}

export const SelectedMomContext = createContext<IMomContext | null>(null);
