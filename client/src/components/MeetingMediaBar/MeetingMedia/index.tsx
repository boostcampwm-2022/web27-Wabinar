import { memo, useEffect, useRef } from 'react';
import { useUserContext } from 'src/hooks/useUserContext';

import style from './style.module.scss';

interface MediaProps {
  stream: MediaStream;
  muted: boolean;
}

function MeetingMedia({ stream, muted }: MediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const { user } = useUserContext();

  const defaultUsername = '익명';

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <>
      <video className={style.video} ref={ref} muted={muted} autoPlay />
      <span className={style.username}>
        {user ? user.name : defaultUsername}
      </span>
    </>
  );
}

export default memo(MeetingMedia);
