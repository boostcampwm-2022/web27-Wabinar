import { useEffect, useState } from 'react';
import { useCRDT } from 'src/hooks/useCRDT';
import useSelectedMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
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

  const onTitleChange: React.FormEventHandler<HTMLHeadingElement> = (e) => {
    /*
      제목 변경하는 요청
      const title = e.target as HTMLHeadingElement;
      title.innerText
      OR
      titleRef.current.innerText
    */
    const title = e.target as HTMLHeadingElement;
  };

  const [blocks, setBlocks] = useState<string[]>([]);

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLParagraphElement;

    if (e.key === 'Enter') {
      e.preventDefault();

      const blockId = uuid();
      const { index } = target.dataset;

      const remoteInsertion = localInsertCRDT(Number(index), blockId);

      setBlocks(spreadCRDT());
      socket.emit('block-insertion', blockId, remoteInsertion);
      return;
    }

    if (e.key === 'Backspace') {
      if (target.innerText.length) return;

      e.preventDefault();

      const { index } = target.dataset;

      const remoteDeletion = localDeleteCRDT(Number(index));

      setBlocks(spreadCRDT());
      socket.emit('block-deletion', remoteDeletion);
    }
  };

  useEffect(() => {
    if (!selectedMom) return;

    socket.emit('mom-initialization', selectedMom._id);

    socket.on('mom-initialization', (crdt) => {
      syncCRDT(crdt);
      setBlocks(spreadCRDT());
    });
  }, [selectedMom]);

  useEffect(() => {
    socket.on('block-insertion', (op) => {
      remoteInsertCRDT(op);
      setBlocks(spreadCRDT());
    });

    socket.on('block-deletion', (op) => {
      remoteDeleteCRDT(op);
      setBlocks(spreadCRDT());
    });

    socket.on('block-initialization', (id, crdt) => {
      ee.emit(`block-initialization-${id}`, crdt);
    });

    socket.on('text-insertion', (id, op) => {
      ee.emit(`text-insertion-${id}`, op);
    });

    socket.on('text-deletion', (id, op) => {
      ee.emit(`text-deletion-${id}`, op);
    });

    return () => {
      socket.off('block-initialization');
      socket.off('text-insertion');
      socket.off('text-deletion');
    };
  }, []);

  return (
    <div className={style['mom-container']}>
      <div className={style['mom']}>
        {selectedMom ? (
          <>
            <div className={style['mom-header']}>
              <h1
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={onTitleChange}
              >
                {selectedMom.name}
              </h1>
              <span>{new Date(selectedMom.createdAt).toLocaleString()}</span>
            </div>
            <div className={style['mom-body']}>
              <Block
                id={'test'}
                data-index={0}
                onKeyDown={onKeyDown}
                // 테스트용 고정 블럭
              />
              {blocks.map((id, index) => (
                <Block
                  key={id}
                  id={id}
                  data-index={index}
                  onKeyDown={onKeyDown}
                />
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
