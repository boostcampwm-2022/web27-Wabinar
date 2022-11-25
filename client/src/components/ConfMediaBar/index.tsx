import ConfMedia from './ConfMedia';

interface ConfMediaBarProps {
  streams: Map<string, MediaStream>;
}

function ConfMediaBar({ streams }: ConfMediaBarProps) {
  return (<div>
    {
      Array.from(streams).map(entry => {
        const [id, stream] = entry;

        return <ConfMedia key={id} stream={stream} />
      })
    }
  </div>);
}

export default ConfMediaBar;