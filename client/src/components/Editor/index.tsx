import { useRef } from 'react';
import { useUserContext } from 'src/hooks/useUserContext';
import CRDT from 'src/utils/crdt';

import style from './style.module.scss';

function Editor() {
  const userContext = useUserContext();
  const crdt = new CRDT(1, userContext.userInfo?.user.id);

  const offsetRef = useRef<number | null>(null);

  const setOffsetRef = () => {
    const selection = window.getSelection();

    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);

      offsetRef.current = range.startOffset;
    }
  };

  const clearOffsetRef = () => {
    offsetRef.current = null;
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      console.log('새 블럭이 생길거에요 ^^');
    }
  };

  return (
    <p
      className={style['editor-container']}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onFocus={setOffsetRef}
      onClick={setOffsetRef}
      onBlur={clearOffsetRef}
      onKeyDown={onKeyDown}
      onKeyUp={setOffsetRef}
    >
      {crdt.read()}
    </p>
  );
}

export default Editor;
