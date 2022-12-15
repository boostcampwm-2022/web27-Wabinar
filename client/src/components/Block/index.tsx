import { BiPlus } from '@react-icons/all-files/bi/BiPlus';
import * as BlockMessage from '@wabinar/api-types/block';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import ee from 'components/Mom/EventEmitter';
import { memo, useEffect, useRef, useState } from 'react';
import useSocketContext from 'src/hooks/context/useSocketContext';

import QuestionBlock from './QuestionBlock';
import style from './style.module.scss';
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
  createBlock: (arg: number) => void;
  onHandleBlocks: React.KeyboardEventHandler;
  registerRef: (arg: React.RefObject<HTMLElement>) => void;
}

function Block({
  id,
  index,
  createBlock,
  onHandleBlocks,
  registerRef,
}: BlockProps) {
  const { momSocket: socket } = useSocketContext();

  const [type, setType] = useState<BlockType>();
  const localUpdateFlagRef = useRef<boolean>(false);

  useEffect(() => {
    const message: BlockMessage.LoadType = { id };
    const callback = ({ type }: BlockMessage.LoadedType) => setType(type);

    socket.emit(BLOCK_EVENT.LOAD_TYPE, message, callback);

    ee.on(`${BLOCK_EVENT.UPDATE_TYPE}-${id}`, (type) => {
      setType(type);
      localUpdateFlagRef.current = false;
    });
  }, []);

  useEffect(() => {
    if (localUpdateFlagRef.current && type) {
      const message: BlockMessage.UpdateType = { id, type };
      socket.emit(BLOCK_EVENT.UPDATE_TYPE, message);
    }
  }, [type]);

  const setBlockType = (type: BlockType) => {
    localUpdateFlagRef.current = true;
    setType(type);

    if ([BlockType.VOTE, BlockType.QUESTION].includes(type)) {
      createBlock(index);
    }
  };

  const onCreate = () => createBlock(index);

  const getCurrentBlock = () => {
    switch (type) {
      case BlockType.H1:
      case BlockType.H2:
      case BlockType.H3:
      case BlockType.P:
        return (
          <TextBlock
            id={id}
            index={index}
            onHandleBlocks={onHandleBlocks}
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
        return <></>;
    }
  };

  return (
    <div className={style['block']}>
      <BiPlus size={20} onClick={onCreate} />
      {getCurrentBlock()}
    </div>
  );
}

function isMemoized(prev: BlockProps, next: BlockProps) {
  return prev.id === next.id;
}

export default memo(Block, isMemoized);
