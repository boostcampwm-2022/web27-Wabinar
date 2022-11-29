import { createContext, Dispatch, SetStateAction } from 'react';

interface IConfContext {
  isStart: boolean;
  setIsStart: Dispatch<SetStateAction<boolean>>;
}

const ConfContext = createContext<IConfContext | null>(null);

export default ConfContext;
