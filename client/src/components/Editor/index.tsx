import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import env from 'src/config';
import { useUserContext } from 'src/hooks/useUserContext';
import CRDT from 'src/utils/crdt';

import style from './style.module.scss';

function Editor() {
  const workspace = useParams();
  const socket: Socket = io(`${env.SERVER_PATH}/sc-workspace/${workspace.id}`);

  const userContext = useUserContext();
  const crdt = new CRDT(1, userContext.userInfo?.user.id);

  const offsetRef = useRef<number | null>(null);
  const blockRef = useRef<HTMLParagraphElement>(null);

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

  const updateSelectionRange = (offset = 0) => {
    if (!blockRef.current || offsetRef.current === null) return;

    const selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();

    const range = new Range();

    // 우선 블럭의 첫번째 text node로 고정, text node가 없는 경우는 offsetRef 설정 안해줌
    if (!blockRef.current.firstChild) {
      offsetRef.current = null;
      return;
    }

    range.setStart(blockRef.current.firstChild, offsetRef.current + offset);
    range.collapse();
    selection.addRange(range);

    setOffsetRef(); // 바뀐 range 정보를 반영
  };

  const onInput: React.FormEventHandler = (e) => {
    setOffsetRef();

    if (offsetRef.current === null) return;

    const caretOffset = offsetRef.current;

    const event = e.nativeEvent as InputEvent;

    if (event.inputType === 'deleteContentBackward') {
      const remoteDeletion = crdt.localDelete(caretOffset);

      socket.emit('mom-deletion', remoteDeletion);
      return;
    }

    const letter = event.data as string;

    const remoteInsertion = crdt.localInsert(caretOffset - 2, letter); // 직전 문자의 인덱스
    socket.emit('mom-insertion', remoteInsertion);
  };

  useEffect(() => {
    socket.on('mom-insertion', (op) => {
      const prevIndex = crdt.remoteInsert(op) ?? -1;

      if (!blockRef.current) return;

      blockRef.current.innerText = crdt.read();

      if (offsetRef.current === null) return;

      updateSelectionRange(Number(prevIndex < offsetRef.current));
    });

    socket.on('mom-deletion', (op) => {
      const targetIndex = crdt.remoteDelete(op) ?? -1;

      if (!blockRef.current) return;

      blockRef.current.innerText = crdt.read();

      if (offsetRef.current === null) return;

      updateSelectionRange(-Number(targetIndex <= offsetRef.current));
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <p
      ref={blockRef}
      className={style['editor-container']}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={onInput}
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
