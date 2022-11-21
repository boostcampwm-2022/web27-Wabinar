import style from './style.module.scss';

function Mom() {
  // context나 props로 가져오기
  const selectedMom = {
    id: 1,
    name: '회의록 1',
    createdAt: new Date(),
  };

  /*
    contentEditable 내용을 컨트롤하고 싶다면 ref 활용해볼 수 있음
    const titleRef = useRef<HTMLHeadingElement>(null);
  */

  const onTitleChange: React.FormEventHandler<HTMLHeadingElement> = (e) => {
    /*
      제목 변경하는 요청
      const title = e.target as HTMLHeadingElement;
      title.innerText
      OR
      titleRef.current.innerText
    */
  };

  return (
    <div className={style['mom-container']}>
      <div className={style['mom']}>
        <div className={style['mom-header']}>
          <h1
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={onTitleChange}
          >
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
