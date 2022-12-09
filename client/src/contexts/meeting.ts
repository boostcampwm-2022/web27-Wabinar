import { createContext, Dispatch, SetStateAction } from 'react';

interface IMeetingContext {
  isOnGoing: boolean;
  setIsOnGoing: Dispatch<SetStateAction<boolean>>;
}

const MeetingContext = createContext<IMeetingContext | null>(null);

export default MeetingContext;
