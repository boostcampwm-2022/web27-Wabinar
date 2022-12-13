import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import { memo } from 'react';
import { MeetingMode } from 'src/constants/rtc';
import { useMeetingContext } from 'src/hooks/useMeetingContext';
import useSocketContext from 'src/hooks/useSocketContext';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

function MeetingButton() {
  const { workspaceSocket: socket } = useSocketContext();

  const MeetingContext = useMeetingContext();
  const { meetingMode, setMeetingMode } = MeetingContext;

  const onClick = () => {
    const newMeetingMode =
      meetingMode === MeetingMode.GOING
        ? MeetingMode.NOT_GOING
        : MeetingMode.READY;
    setMeetingMode(newMeetingMode);

    socket.emit(
      meetingMode === MeetingMode.GOING
        ? WORKSPACE_EVENT.END_MEETING
        : WORKSPACE_EVENT.START_MEETING,
    );
  };

  return (
    <button
      className={style['meeting-button']}
      onClick={onClick}
      style={{
        backgroundColor:
          meetingMode === MeetingMode.GOING ? color.red : color.green,
      }}
    >
      {meetingMode === MeetingMode.GOING ? '회의종료' : '회의시작'}
    </button>
  );
}

export default memo(MeetingButton);
