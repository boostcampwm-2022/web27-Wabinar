import { BLOCK_EVENT, MOM_EVENT } from '@wabinar/constants/socket-message';
import Block from 'components/Block';
import { useEffect, useRef, useState } from 'react';
import { useCRDT } from 'src/hooks/useCRDT';
import useDebounce from 'src/hooks/useDebounce';
import useSelectedMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
import { v4 as uuid } from 'uuid';

import DefaultMom from './DefaultMom';
import ee from './EventEmitter';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();
  const { momSocket: socket } = useSocketContext();

  const initMom = () => {
    if (!selectedMom) return;
    socket.emit(MOM_EVENT.INIT, selectedMom._id);
  };

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
    () => {
      if (!titleRef.current) return;

      const title = titleRef.current.innerText;

      socket.emit(MOM_EVENT.UPDATE_TITLE, title);
    },
    500,
  );

  const [blocks, setBlocks] = useState<string[]>([]);

  const blockRefs = useRef<React.RefObject<HTMLElement>[]>([]);
  const focusIndex = useRef<number>();

  const updateBlockFocus = (idx: number | undefined) => {
    focusIndex.current = idx;
  };

  const setBlockFocus = (index: number) => {
    if (!blockRefs.current || focusIndex.current === undefined) return;

    const idx = focusIndex.current;
    if (index === undefined || index !== idx) return;

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

  const onHandleBlock: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLParagraphElement;

    const { index: indexString } = target.dataset;
    const index = Number(indexString);

    if (e.key === 'Enter') {
      e.preventDefault();

      const blockId = uuid();

      try {
        const remoteInsertion = localInsertCRDT(index, blockId);

        updateBlockFocus(index + 1);

        socket.emit(MOM_EVENT.INSERT_BLOCK, blockId, remoteInsertion);
      } catch {
        initMom();
      }

      return;
    }

    if (e.key === 'Backspace') {
      if (target.innerText.length) return;

      const { id } = target.dataset;

      e.preventDefault();

      if (index === 0) return;

      try {
        const remoteDeletion = localDeleteCRDT(index);

        updateBlockFocus(index - 1);

        setBlocks(spreadCRDT());

        if (focusIndex.current === undefined) return;
        setBlockFocus(focusIndex.current);

        setCaretToEnd();

        socket.emit(MOM_EVENT.DELETE_BLOCK, id, remoteDeletion);
      } catch {
        initMom();
      }
    }
  };

  useEffect(() => {
    initMom();

    socket.on(MOM_EVENT.INIT, (crdt) => {
      syncCRDT(crdt);
      setBlocks(spreadCRDT());
    });

    socket.on(MOM_EVENT.UPDATE_TITLE, (title) => {
      if (!titleRef.current) return;

      titleRef.current.innerText = title;
    });

    socket.on(MOM_EVENT.UPDATED, () => {
      setBlocks(spreadCRDT());
    });

    socket.on(MOM_EVENT.INSERT_BLOCK, (op) => {
      try {
        remoteInsertCRDT(op);

        updateBlockFocus(undefined);
        setBlocks(spreadCRDT());
      } catch {
        initMom();
      }
    });

    socket.on(MOM_EVENT.DELETE_BLOCK, (op) => {
      try {
        remoteDeleteCRDT(op);

        updateBlockFocus(undefined);
        setBlocks(spreadCRDT());
      } catch {
        initMom();
      }
    });

    socket.on(BLOCK_EVENT.INIT_TEXT, (id, crdt) => {
      ee.emit(`${BLOCK_EVENT.INIT_TEXT}-${id}`, crdt);
    });

    socket.on(BLOCK_EVENT.INSERT_TEXT, (id, op) => {
      ee.emit(`${BLOCK_EVENT.INSERT_TEXT}-${id}`, op);
    });

    socket.on(BLOCK_EVENT.DELETE_TEXT, (id, op) => {
      ee.emit(`${BLOCK_EVENT.DELETE_TEXT}-${id}`, op);
    });

    socket.on(BLOCK_EVENT.UPDATE_TEXT, (id, crdt) => {
      ee.emit(`${BLOCK_EVENT.UPDATE_TEXT}-${id}`, crdt);
    });

    socket.on(BLOCK_EVENT.UPDATE_TYPE, (id, type) => {
      ee.emit(`${BLOCK_EVENT.UPDATE_TYPE}-${id}`, type);
    });

    return () => {
      [
        MOM_EVENT.INIT,
        MOM_EVENT.UPDATE_TITLE,
        MOM_EVENT.UPDATED,
        MOM_EVENT.INSERT_BLOCK,
        MOM_EVENT.DELETE_BLOCK,
        BLOCK_EVENT.INIT_TEXT,
        BLOCK_EVENT.INSERT_TEXT,
        BLOCK_EVENT.DELETE_TEXT,
        BLOCK_EVENT.UPDATE_TYPE,
      ].forEach((event) => socket.off(event));
    };
  }, [selectedMom]);

  const registerRef =
    (index: number) => (ref: React.RefObject<HTMLElement>) => {
      blockRefs.current[index] = ref;
      setBlockFocus(index);
    };

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
              onHandleBlock={onHandleBlock}
              registerRef={registerRef(index)}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <DefaultMom />
  );
}

export default Mom;
