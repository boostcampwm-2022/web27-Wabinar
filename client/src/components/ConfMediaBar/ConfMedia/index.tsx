import { memo, useEffect, useRef } from 'react';

import style from './style.module.scss';

interface MediaProps {
  stream: MediaStream;
}

function ConfMedia({ stream }: MediaProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return <video className={style.video} ref={ref} autoPlay />;
}

export default memo(ConfMedia);
