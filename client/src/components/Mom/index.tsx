import { useEffect, useRef, useState } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import { useCRDT } from 'src/hooks/useCRDT';
import useDebounce from 'src/hooks/useDebounce';
import useSelectedMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
import { v4 as uuid } from 'uuid';

import Block from './Block';
import DefaultMom from './DefaultMom';
import ee from './EventEmitter';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();
  const { momSocket: socket } = useSocketContext();

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

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLParagraphElement;

    const { index: indexString } = target.dataset;
    const index = Number(indexString);

    if (e.key === 'Enter') {
      e.preventDefault();

      const blockId = uuid();

      const remoteInsertion = localInsertCRDT(index, blockId);

      socket.emit(SOCKET_MESSAGE.MOM.INSERT_BLOCK, blockId, remoteInsertion);
      return;
    }

    if (e.key === 'Backspace') {
      if (target.innerText.length) return;

      const { id } = target.dataset;

      e.preventDefault();

      const remoteDeletion = localDeleteCRDT(index);

      socket.emit(SOCKET_MESSAGE.MOM.DELETE_BLOCK, id, remoteDeletion);
    }
  };

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

    socket.on(SOCKET_MESSAGE.MOM.UPDATED, () => setBlocks(spreadCRDT()));

    socket.on(SOCKET_MESSAGE.MOM.INSERT_BLOCK, (op) => {
      remoteInsertCRDT(op);
      setBlocks(spreadCRDT());
    });

    socket.on(SOCKET_MESSAGE.MOM.DELETE_BLOCK, (op) => {
      remoteDeleteCRDT(op);
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
              onRegisterRef={(ref: React.RefObject<HTMLElement>) => {
                blockRefs.current[index] = ref;
              }}
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
