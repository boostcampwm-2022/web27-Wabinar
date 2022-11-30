import useSelectedMom from 'src/hooks/useSelectedMom';

import Editor from '../Editor';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();

  if (!selectedMom) {
    return (
      <div className={style['mom-container']}>
        <div className={style['mom']}>
          <h1>아직 회의록이 없어요. 만들어 보세요^^</h1>
        </div>
      </div>
    );
  }
  // context나 props로 가져오기

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
    const title = e.target as HTMLHeadingElement;
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
            <Editor />
          </>
        ) : (
          <h1>아직 회의록이 없어요. 만들어 보세요^^</h1>
        )}
      </div>
    </div>
  );
}

export default Mom;
