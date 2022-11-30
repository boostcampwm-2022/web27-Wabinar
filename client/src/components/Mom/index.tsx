import useSelectedMom from 'src/hooks/useSelectedMom';

import Editor from '../Editor';
import style from './style.module.scss';

function Mom() {
  const { selectedMom } = useSelectedMom();

  if (!selectedMom) {
    return <h1>아직 회의록이 없어요. 만들어 보세요^^</h1>;
  }

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
        <Editor />
      </div>
    </div>
  );
}

export default Mom;
