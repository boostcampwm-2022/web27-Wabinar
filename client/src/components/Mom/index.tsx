import useMom from 'src/hooks/useMom';
import useSocketContext from 'src/hooks/useSocketContext';

import Editor from '../Editor';
import style from './style.module.scss';

function Mom() {
  const { mom } = useMom();
  const { momSocket: socket } = useSocketContext();

  if (!mom) {
    return <h1>아직 회의록이 없어요. 만들어 보세요^^</h1>;
  }
  // context나 props로 가져오기
  const selectedMom = {
    id: mom._id,
    name: mom._id,
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
          <span>{selectedMom.createdAt.toLocaleString()}</span>
        </div>
        <Editor />
      </div>
    </div>
  );
}

export default Mom;
