import ConfMedia from './ConfMedia';
import style from './style.module.scss';

interface ConfMediaBarProps {
  streams: Map<string, MediaStream>;
}

function ConfMediaBar({ streams }: ConfMediaBarProps) {
  return (
    <div className={style['conf-bar']}>
      <ul>
        {Array.from(streams).map(([id, stream]) => (
          <li key={id}>
            <ConfMedia key={id} stream={stream} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConfMediaBar;
