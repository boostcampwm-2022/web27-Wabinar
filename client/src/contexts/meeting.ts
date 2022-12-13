import { createContext, Dispatch, SetStateAction } from 'react';
import { MeetingMode } from 'src/constants/rtc';

interface IMeetingContext {
  meetingMode: MeetingMode;
  setMeetingMode: Dispatch<SetStateAction<MeetingMode>>;
}

const MeetingContext = createContext<IMeetingContext | null>(null);

export default MeetingContext;
