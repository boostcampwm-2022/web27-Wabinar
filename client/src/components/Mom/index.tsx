import VoteBlockTemplate from 'common/Templates/VoteBlock';
import { useEffect, useRef, useState } from 'react';
import { VOTE_MODE } from 'src/constants/block';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import { useCRDT } from 'src/hooks/useCRDT';
import useDebounce from 'src/hooks/useDebounce';
import useSelectedMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
import { Option, VoteMode } from 'src/types/block';
import { v4 as uuid } from 'uuid';

import Block from './Block';
import DefaultMom from './DefaultMom';
import ee from './EventEmitter';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();
  const { momSocket: socket } = useSocketContext();

  const [voteMode, setVoteMode] = useState<VoteMode | null>(null);

  const {
    syncCRDT,
    spreadCRDT,
    localInsertCRDT,
    localDeleteCRDT,
    remoteInsertCRDT,
    remoteDeleteCRDT,
  } = useCRDT();

  const titleRef = useRef<HTMLHeadingElement>(null);

  const onTitleUpdate: React.FormEventHandler<HTMLHeadingElement> = useDebounce(
    (e) => {
      if (!titleRef.current) return;

      const title = titleRef.current.innerText;

      socket.emit(SOCKET_MESSAGE.MOM.UPDATE_TITLE, title);
    },
    500,
  );

  const [blocks, setBlocks] = useState<string[]>([]);

  const blockRefs = useRef<React.RefObject<HTMLElement>[]>([]);
  const focusIndex = useRef<number>();

  const updateBlockFocus = (idx: number | undefined) => {
    focusIndex.current = idx;
  };

  const setBlockFocus = () => {
    if (!blockRefs.current || focusIndex.current === undefined) return;

    const idx = focusIndex.current;

    const targetBlock = blockRefs.current[idx];

    if (!targetBlock || !targetBlock.current) return;

    targetBlock.current.focus();
  };

  const setCaretToEnd = () => {
    const selection = getSelection();

    if (!selection) return;

    const range = selection.getRangeAt(0);

    if (!range) return;

    range.selectNodeContents(range.startContainer);
    range.collapse();
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLParagraphElement;

    const { index: indexString } = target.dataset;
    const index = Number(indexString);

    if (e.key === 'Enter') {
      e.preventDefault();

      const blockId = uuid();

      const remoteInsertion = localInsertCRDT(index, blockId);

      updateBlockFocus(index + 1);

      socket.emit(SOCKET_MESSAGE.MOM.INSERT_BLOCK, blockId, remoteInsertion);
      return;
    }

    if (e.key === 'Backspace') {
      if (target.innerText.length) return;

      const { id } = target.dataset;

      e.preventDefault();

      if (index === 0) return;

      const remoteDeletion = localDeleteCRDT(index);

      updateBlockFocus(index - 1);

      setBlocks(spreadCRDT());
      setBlockFocus();
      setCaretToEnd();

      socket.emit(SOCKET_MESSAGE.MOM.DELETE_BLOCK, id, remoteDeletion);
    }
  };

  const initialOption: Option[] = [{ id: 1, text: '', count: 0 }];
  const [options, setOptions] = useState<Option[]>(initialOption);

  useEffect(() => {
    setBlockFocus();
  }, [blocks]);

  useEffect(() => {
    if (!selectedMom) return;

    socket.emit(SOCKET_MESSAGE.MOM.INIT, selectedMom._id);

    socket.on(SOCKET_MESSAGE.MOM.INIT, (crdt) => {
      syncCRDT(crdt);
      setBlocks(spreadCRDT());
    });

    socket.on(SOCKET_MESSAGE.MOM.UPDATE_TITLE, (title) => {
      if (!titleRef.current) return;

      titleRef.current.innerText = title;
    });

    socket.on(SOCKET_MESSAGE.MOM.UPDATED, () => {
      setBlocks(spreadCRDT());
    });

    socket.on(SOCKET_MESSAGE.MOM.INSERT_BLOCK, (op) => {
      remoteInsertCRDT(op);

      updateBlockFocus(undefined);
      setBlocks(spreadCRDT());
    });

    socket.on(SOCKET_MESSAGE.MOM.DELETE_BLOCK, (op) => {
      remoteDeleteCRDT(op);

      updateBlockFocus(undefined);
      setBlocks(spreadCRDT());
    });

    socket.on(SOCKET_MESSAGE.BLOCK.INIT, (id, crdt) => {
      ee.emit(`${SOCKET_MESSAGE.BLOCK.INIT}-${id}`, crdt);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.INSERT_TEXT, (id, op) => {
      ee.emit(`${SOCKET_MESSAGE.BLOCK.INSERT_TEXT}-${id}`, op);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.DELETE_TEXT, (id, op) => {
      ee.emit(`${SOCKET_MESSAGE.BLOCK.DELETE_TEXT}-${id}`, op);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.UPDATE_TEXT, (id, crdt) => {
      ee.emit(`${SOCKET_MESSAGE.BLOCK.UPDATE_TEXT}-${id}`, crdt);
    });

    socket.on(SOCKET_MESSAGE.BLOCK.UPDATE_TYPE, (id, type) => {
      ee.emit(`${SOCKET_MESSAGE.BLOCK.UPDATE_TYPE}-${id}`, type);
    });

    socket.on(SOCKET_MESSAGE.MOM.CREATE_VOTE, (options) => {
      setVoteMode(VOTE_MODE.REGISTERED as VoteMode);
      setOptions(options);
    });

    return () => {
      [
        SOCKET_MESSAGE.MOM.INIT,
        SOCKET_MESSAGE.MOM.UPDATE_TITLE,
        SOCKET_MESSAGE.MOM.UPDATED,
        SOCKET_MESSAGE.MOM.INSERT_BLOCK,
        SOCKET_MESSAGE.MOM.DELETE_BLOCK,
        SOCKET_MESSAGE.BLOCK.INIT,
        SOCKET_MESSAGE.BLOCK.INSERT_TEXT,
        SOCKET_MESSAGE.BLOCK.DELETE_TEXT,
        SOCKET_MESSAGE.BLOCK.UPDATE_TYPE,
        SOCKET_MESSAGE.MOM.CREATE_VOTE,
      ].forEach((event) => socket.off(event));
    };
  }, [selectedMom]);

  return selectedMom ? (
    <div className={style['mom-container']}>
      <div className={style['mom']}>
        <div className={style['mom-header']}>
          <h1
            ref={titleRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={onTitleUpdate}
          >
            {selectedMom.title}
          </h1>
          <span>{new Date(selectedMom.createdAt).toLocaleString()}</span>
        </div>

        <div className={style['mom-body']}>
          {blocks.map((id, index) => (
            <Block
              key={id}
              id={id}
              index={index}
              onKeyDown={onKeyDown}
              registerRef={(ref: React.RefObject<HTMLElement>) => {
                blockRefs.current[index] = ref;
              }}
            />
          ))}
        </div>
        {/* TODO: 임시로 놓은 투표 블록임 */}
        <button onClick={() => setVoteMode('create')}>투표 등록</button>
        {voteMode && (
          <VoteBlockTemplate
            mode={voteMode}
            setVoteMode={setVoteMode}
            options={options}
            setOptions={setOptions}
          />
        )}
      </div>
    </div>
  ) : (
    <DefaultMom />
  );
}

export default Mom;
