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
          <li key={stream.id}>
            {stream && (
              <div>
                <Video stream={stream} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConfBar;
