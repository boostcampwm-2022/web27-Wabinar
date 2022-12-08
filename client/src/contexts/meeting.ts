import { createContext, Dispatch, SetStateAction } from 'react';

interface IMeetingContext {
  isStart: boolean;
  setIsStart: Dispatch<SetStateAction<boolean>>;
}

const MeetingContext = createContext<IMeetingContext | null>(null);

export default MeetingContext;
