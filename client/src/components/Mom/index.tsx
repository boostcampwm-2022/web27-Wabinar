import { useEffect, useRef, useState } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import { useCRDT } from 'src/hooks/useCRDT';
import useSelectedMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
import { debounce } from 'src/utils/debounce';
import { v4 as uuid } from 'uuid';

import Block from './Block';
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

  const onTitleUpdate: React.FormEventHandler<HTMLHeadingElement> = debounce(
    (e) => {
      if (!titleRef.current) return;

      const title = titleRef.current.innerText;

      socket.emit(SOCKET_MESSAGE.MOM.UPDATE_TITLE, title);
    },
    500,
  );

  const [blocks, setBlocks] = useState<string[]>([]);

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLParagraphElement;

    const { index } = target.dataset;

    if (e.key === 'Enter') {
      e.preventDefault();

      const blockId = uuid();

      const remoteInsertion = localInsertCRDT(Number(index), blockId);

      socket.emit(SOCKET_MESSAGE.MOM.INSERT_BLOCK, blockId, remoteInsertion);
      return;
    }

    if (e.key === 'Backspace') {
      if (target.innerText.length) return;

      const { id } = target.dataset;

      e.preventDefault();

      const remoteDeletion = localDeleteCRDT(Number(index));

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

    return () => {
      socket.off(SOCKET_MESSAGE.MOM.INIT);
    };
  }, [selectedMom]);

  useEffect(() => {
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
        SOCKET_MESSAGE.MOM.UPDATE_TITLE,
        SOCKET_MESSAGE.MOM.UPDATED,
        SOCKET_MESSAGE.MOM.INSERT_BLOCK,
        SOCKET_MESSAGE.MOM.DELETE_BLOCK,
        SOCKET_MESSAGE.BLOCK.INIT,
        SOCKET_MESSAGE.BLOCK.INSERT_TEXT,
        SOCKET_MESSAGE.BLOCK.DELETE_TEXT,
      ].forEach((event) => socket.off(event));
    };
  }, []);

  return (
    <div className={style['mom-container']}>
      <div className={style['mom']}>
        {selectedMom ? (
          <>
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
                <Block key={id} id={id} index={index} onKeyDown={onKeyDown} />
              ))}
            </div>
          </>
        ) : (
          <h1>아직 회의록이 없어요. 만들어 보세요^^</h1>
        )}
      </div>
    </div>
  );
}

export default Mom;
