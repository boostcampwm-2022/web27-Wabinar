import React from 'react';

import style from './style.module.scss';

function Mom() {
  // context나 props로 가져오기
  const selectedMom = {
    id: 1,
    name: '회의록 1',
    createdAt: new Date(),
  };

  const onTitleChange = (e: React.FormEvent<HTMLParagraphElement>) => {
    const title = e.target as HTMLElement;

    console.log(title.innerText);

    // 제목 변경하는 요청
  };

  return (
    <div className={style['mom-container']}>
      <div className={style['mom']}>
        <div className={style['mom-header']}>
          <h1 contentEditable={true} onInput={onTitleChange}>
            {selectedMom.name}
          </h1>
          <span>{selectedMom.createdAt.toLocaleString()}</span>
        </div>
        <div className={style['editor-container']}>회의록 내용</div>
      </div>
    </div>
  );
}

export default Mom;
