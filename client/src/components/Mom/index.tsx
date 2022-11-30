import { useState } from 'react';
import useSelectedMom from 'src/hooks/useSelectedMom';

import Block from './Block';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();

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
        setBlocks((prev) => [...prev, prev.length]);
        break;
      default:
        return;
    }
  };

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
                {selectedMom._id}
              </h1>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className={style['mom-body']}>
              <Block onKeyDown={onKeyDown} />
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
