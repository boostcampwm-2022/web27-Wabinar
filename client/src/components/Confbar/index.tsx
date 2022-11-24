import style from './style.module.scss';
import Video from './Video';

interface ConfBarProps {
  streams: MediaStream[];
}

function ConfBar({ streams }: ConfBarProps) {
  return (
    <div className={style['conf-bar']}>
      <ul>
        {streams.map((stream) => (
          <div key={stream.id}>
            {stream && (
              <li>
                <Video stream={stream} />
              </li>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ConfBar;
