import { useEffect, useRef } from 'react';

import style from './style.module.scss';

interface VideoProps {
  stream: MediaStream;
}

function Video({ stream }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return <video className={style.video} ref={ref} autoPlay muted />;
}

export default Video;
