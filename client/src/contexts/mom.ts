import { createContext, Dispatch, SetStateAction } from 'react';

interface IMomContext {
  isStart: boolean;
  setIsStart: Dispatch<SetStateAction<boolean>>;
}

const MomContext = createContext<IMomContext | null>(null);

export default MomContext;
