import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { memo, useEffect, useRef, useState } from 'react';
import QuestionBlock from 'src/components/QuestionBlock';
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
  registerRef: (arg: React.RefObject<HTMLElement>) => void;
}

function Block({ id, index, onKeyDown, registerRef }: BlockProps) {
  const { momSocket: socket } = useSocketContext();

  const [type, setType] = useState<BlockType>();
  const localUpdateFlagRef = useRef<boolean>(false);

  useEffect(() => {
    socket.emit(BLOCK_EVENT.LOAD_TYPE, id, (type: BlockType) => setType(type));

    ee.on(`${BLOCK_EVENT.UPDATE_TYPE}-${id}`, (type) => {
      setType(type);
      localUpdateFlagRef.current = false;
    });
  }, []);

  useEffect(() => {
    if (localUpdateFlagRef.current) {
      socket.emit(BLOCK_EVENT.UPDATE_TYPE, id, type);
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
          registerRef={registerRef}
        />
      );
    case BlockType.VOTE:
    case BlockType.QUESTION:
      return <QuestionBlock />;
    default:
      return <p />;
  }
}

export default memo(Block);
