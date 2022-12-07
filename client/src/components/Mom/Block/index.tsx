import { useState, useEffect, memo, useRef } from 'react';
import useSocketContext from 'src/hooks/useSocketContext';

import ee from '../EventEmitter';
import TextBlock from './TextBlock';

export enum BlockType {
  H1,
  H2,
  H3,
  P,
  VOTE,
  QUESTION,
}

interface BlockProps {
  id: string;
  index: number;
  onKeyDown: React.KeyboardEventHandler;
}

function Block({ id, index, onKeyDown }: BlockProps) {
  const { momSocket: socket } = useSocketContext();

  const [type, setType] = useState<BlockType>();
  const localUpdateFlagRef = useRef<boolean>(false);

  useEffect(() => {
    socket.emit('load-type', id, (type: BlockType) => setType(type));

    ee.on(`update-type-${id}`, (type) => {
      setType(type);
      localUpdateFlagRef.current = false;
    });
  }, []);

  useEffect(() => {
    if (localUpdateFlagRef.current) {
      socket.emit('update-type', id, type);
    }
  }, [type]);

  const setBlockType = (id: BlockType) => {
    localUpdateFlagRef.current = true;
    setType(id);
  };

  switch (type) {
    case BlockType.H1:
    case BlockType.H2:
    case BlockType.H3:
    case BlockType.P:
      return (
        <TextBlock
          id={id}
          index={index}
          onKeyDown={onKeyDown}
          type={type}
          setType={setBlockType}
        />
      );
    default:
      return <p />;
  }
}

export default memo(Block);
