import { useEffect, useState } from 'react';
import useSelectedMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';

import Block from './Block';
import ee from './EventEmitter';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();

  const { momSocket: socket } = useSocketContext();

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

  const [blocks, setBlocks] = useState<number[]>([]);

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();

        // TODO: api로 빈 블럭 하나 생성하고 Mom CRDT에 id 삽입

        setBlocks((prev) => [...prev, prev.length]);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
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
                id={
                  selectedMom._id // TODO: blockId 수정
                }
                onKeyDown={onKeyDown}
              />
              {blocks.map((el) => (
                <p key={el}>{el}</p>
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
