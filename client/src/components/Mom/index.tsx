import * as BlockMessage from '@wabinar/api-types/block';
import * as MomMessage from '@wabinar/api-types/mom';
import { BLOCK_EVENT, MOM_EVENT } from '@wabinar/constants/socket-message';
import Block from 'components/Block';
import { useEffect, useRef, useState } from 'react';
import useSelectedMomContext from 'src/hooks/context/useSelectedMomContext';
import useSocketContext from 'src/hooks/context/useSocketContext';
import { useCRDT } from 'src/hooks/useCRDT';
import useDebounce from 'src/hooks/useDebounce';
import { v4 as uuid } from 'uuid';

import ee from './EventEmitter';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMomContext();
  const { momSocket: socket } = useSocketContext();

  const initMom = () => {
    if (!selectedMom) return;

    socket.emit(MOM_EVENT.INIT);
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
  const blockRefs = useRef<React.RefObject<HTMLElement>[]>([]);
  const focusIndex = useRef<number>();

  const [blocks, setBlocks] = useState<string[]>([]);

  const onTitleUpdate: React.FormEventHandler<HTMLHeadingElement> = useDebounce(
    () => {
      if (!titleRef.current) return;

      const title = titleRef.current.innerText;

      const message: MomMessage.UpdateTitle = { title };
      socket.emit(MOM_EVENT.UPDATE_TITLE, message);

      ee.emit(MOM_EVENT.UPDATE_TITLE, title);
    },
    500,
  );

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

  const createBlock = (index: number) => {
    const blockId = uuid();

    let remoteInsertion;

    try {
      remoteInsertion = localInsertCRDT(index, blockId);
    } catch {
      initMom();
      return;
    }

    const message: MomMessage.InsertBlock = { blockId, op: remoteInsertion };
    socket.emit(MOM_EVENT.INSERT_BLOCK, message);
  };

  const deleteBlock = (id: string, index: number) => {
    let remoteDeletion;

    try {
      remoteDeletion = localDeleteCRDT(index);
    } catch {
      initMom();
      return;
    }

    const message: MomMessage.DeleteBlock = { blockId: id, op: remoteDeletion };
    socket.emit(MOM_EVENT.DELETE_BLOCK, message);
  };

  const onHandleBlocks: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLParagraphElement;

    const { index: indexString } = target.dataset;
    const index = Number(indexString);

    if (e.key === 'Enter') {
      e.preventDefault();

      createBlock(index);
      updateBlockFocus(index + 1);
      return;
    }

    if (e.key === 'Backspace') {
      if (target.innerText.length) return;

      e.preventDefault();

      const { id } = target.dataset;

      if (!id || index === 0) return;

      deleteBlock(id, index);

      updateBlockFocus(index - 1);
      setBlocks(spreadCRDT());

      if (focusIndex.current !== undefined) {
        setBlockFocus(focusIndex.current);
        setCaretToEnd();
      }
    }
  };

  useEffect(() => {
    initMom();

    socket.on(MOM_EVENT.INIT, ({ crdt }: MomMessage.Initialized) => {
      syncCRDT(crdt);
      setBlocks(spreadCRDT());
    });

    socket.on(MOM_EVENT.UPDATE_TITLE, ({ title }: MomMessage.UpdatedTitle) => {
      if (!titleRef.current) return;

      titleRef.current.innerText = title;
      ee.emit(MOM_EVENT.UPDATE_TITLE, title);
    });

    socket.on(MOM_EVENT.UPDATED, () => {
      setBlocks(spreadCRDT());
    });

    socket.on(MOM_EVENT.INSERT_BLOCK, ({ op }: MomMessage.InsertedBlock) => {
      try {
        remoteInsertCRDT(op);
      } catch {
        initMom();
        return;
      }

      updateBlockFocus(undefined);
      setBlocks(spreadCRDT());
    });

    socket.on(MOM_EVENT.DELETE_BLOCK, ({ op }: MomMessage.DeletedBlock) => {
      try {
        remoteDeleteCRDT(op);
      } catch {
        initMom();
        return;
      }

      updateBlockFocus(undefined);
      setBlocks(spreadCRDT());
    });

    const onInitializedText = ({ id, crdt }: BlockMessage.InitializedText) => {
      ee.emit(`${BLOCK_EVENT.INIT_TEXT}-${id}`, crdt);
    };

    const onInsertedText = ({ id, op }: BlockMessage.InsertedText) => {
      ee.emit(`${BLOCK_EVENT.INSERT_TEXT}-${id}`, op);
    };

    const onDeletedText = ({ id, op }: BlockMessage.DeletedText) => {
      ee.emit(`${BLOCK_EVENT.DELETE_TEXT}-${id}`, op);
    };

    const onUpdatedText = ({ id, crdt }: BlockMessage.UpdatedText) => {
      ee.emit(`${BLOCK_EVENT.UPDATE_TEXT}-${id}`, crdt);
    };

    const onUpdatedType = ({ id, type }: BlockMessage.UpdatedType) => {
      ee.emit(`${BLOCK_EVENT.UPDATE_TYPE}-${id}`, type);
    };

    socket.on(BLOCK_EVENT.INIT_TEXT, onInitializedText);
    socket.on(BLOCK_EVENT.INSERT_TEXT, onInsertedText);
    socket.on(BLOCK_EVENT.DELETE_TEXT, onDeletedText);
    socket.on(BLOCK_EVENT.UPDATE_TEXT, onUpdatedText);
    socket.on(BLOCK_EVENT.UPDATE_TYPE, onUpdatedType);

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
  }, [selectedMom, socket]);

  const registerRef =
    (index: number) => (ref: React.RefObject<HTMLElement>) => {
      blockRefs.current[index] = ref;
      setBlockFocus(index);
    };

  return (
    <div className={style['mom-container']}>
      {selectedMom && (
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
                createBlock={createBlock}
                onHandleBlocks={onHandleBlocks}
                registerRef={registerRef(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Mom;
