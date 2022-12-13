import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import ee from 'components/Mom/EventEmitter';
import { memo, useEffect, useRef, useState } from 'react';
import useSocketContext from 'src/hooks/context/useSocketContext';

import QuestionBlock from './QuestionBlock';
import TextBlock from './TextBlock';
import VoteBlock from './VoteBlock';

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
  onHandleBlock: React.KeyboardEventHandler;
  registerRef: (arg: React.RefObject<HTMLElement>) => void;
}

function Block({ id, index, onHandleBlock, registerRef }: BlockProps) {
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

  const setBlockType = (type: BlockType) => {
    localUpdateFlagRef.current = true;
    setType(type);
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
          onHandleBlock={onHandleBlock}
          type={type}
          setType={setBlockType}
          isLocalTypeUpdate={localUpdateFlagRef.current}
          registerRef={registerRef}
        />
      );
    case BlockType.VOTE:
      return <VoteBlock id={id} registerable={localUpdateFlagRef.current} />;
    case BlockType.QUESTION:
      return <QuestionBlock id={id} />;
    default:
      return <p />;
  }
}

export default memo(Block);
