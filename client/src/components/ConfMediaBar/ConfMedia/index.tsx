import { memo, useEffect, useRef } from 'react';

import style from './style.module.scss';

interface MediaProps {
  stream: MediaStream;
  muted: boolean;
}

function ConfMedia({ stream, muted }: MediaProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return <video className={style.video} ref={ref} muted={muted} autoPlay />;
}

export default memo(ConfMedia);
