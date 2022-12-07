import { useState, useEffect, memo } from 'react';
import useSocketContext from 'src/hooks/useSocketContext';

import TextBlock from './TextBlock';

type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'vote' | 'question';

interface BlockProps {
  id: string;
  index: number;
  onKeyDown: React.KeyboardEventHandler;
}

function Block({ id, index, onKeyDown }: BlockProps) {
  const { momSocket: socket } = useSocketContext();

  const [type, setType] = useState<BlockType>();

  useEffect(() => {
    socket.emit('load-type', id, (type: BlockType) => setType(type));
  }, []);

  switch (type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'p':
      return (
        <TextBlock
          id={id}
          index={index}
          onKeyDown={onKeyDown}
          type={type}
          setType={setType}
        />
      );
    default:
      return <p />;
  }
}

export default memo(Block);
