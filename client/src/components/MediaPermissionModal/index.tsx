import { MeetingMode } from 'src/constants/rtc';
import { useCreateMediaStream } from 'src/hooks/useCreateMediaStream';
import { useMeetingContext } from 'src/hooks/useMeetingContext';
import useMyMediaStreamContext from 'src/hooks/useMyMediaStream';
import { useUserContext } from 'src/hooks/useUserContext';

import Button from '../common/Button';
import Modal from '../common/Modal';
import MeetingMedia from '../MeetingMediaBar/MeetingMedia';
import MyStreamButton from '../MeetingMediaBar/StreamButton/MyStreamButton';

function MediaPermissionModal() {
  const { myMediaStream, setMyMediaStream, isMyCamOn } =
    useMyMediaStreamContext();
  const { user } = useUserContext();
  useCreateMediaStream();
  const { setMeetingMode } = useMeetingContext();

  const onJoinMeeting = () => {
    setMeetingMode(MeetingMode.GOING);
  };

  const onClose = () => {
    setMeetingMode(MeetingMode.NOT_GOING);
    myMediaStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setMyMediaStream(new MediaStream());
  };

  return (
    <Modal onClose={onClose}>
      <>
        <MeetingMedia
          stream={myMediaStream}
          enabledCam={isMyCamOn}
          name={user?.name}
          avatarUrl={user?.avatarUrl}
          muted={true}
        />
        <MyStreamButton />
        <Button text="입장하기" onClick={onJoinMeeting} />
      </>
    </Modal>
  );
}
export default MediaPermissionModal;
