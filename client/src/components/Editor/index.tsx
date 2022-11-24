import CRDT from '@wabinar/crdt';
import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import env from 'src/config';
import { useUserContext } from 'src/hooks/useUserContext';

import style from './style.module.scss';

function Editor() {
  const workspace = useParams();
  const socket: Socket = io(`${env.SERVER_PATH}/sc-workspace/${workspace.id}`);

  const crdtRef = useRef<CRDT | null>(null);
  const userContext = useUserContext();

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
      const remoteDeletion = crdtRef.current?.localDelete(caretOffset);

      socket.emit('mom-deletion', remoteDeletion);
      return;
    }

    const letter = event.data as string;

    const remoteInsertion = crdtRef.current?.localInsert(
      caretOffset - 2, // 직전 문자의 인덱스
      letter,
    );
    socket.emit('mom-insertion', remoteInsertion);
  };

  useEffect(() => {
    socket.on('mom-insertion', (op) => {
      const prevIndex = crdtRef.current?.remoteInsert(op) ?? -1;

      if (!blockRef.current || !crdtRef.current) return;

      blockRef.current.innerText = crdtRef.current.read();

      if (offsetRef.current === null) return;

      updateSelectionRange(Number(prevIndex < offsetRef.current));
    });

    socket.on('mom-deletion', (op) => {
      const targetIndex = crdtRef.current?.remoteDelete(op) ?? -1;

      if (!blockRef.current || !crdtRef.current) return;

      blockRef.current.innerText = crdtRef.current.read();

      if (offsetRef.current === null) return;

      updateSelectionRange(-Number(targetIndex <= offsetRef.current));
    });

    socket.on('mom-initialization', (crdt) => {
      Object.setPrototypeOf(crdt, CRDT.prototype);

      crdtRef.current = crdt;
      crdtRef.current?.setClientId(userContext.userInfo?.user.id);

      if (!blockRef.current || !crdtRef.current) return;

      blockRef.current.innerText = crdtRef.current.read();
      blockRef.current.contentEditable = 'true';
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
      suppressContentEditableWarning={true}
      onInput={onInput}
      onFocus={setOffsetRef}
      onClick={setOffsetRef}
      onBlur={clearOffsetRef}
      onKeyDown={onKeyDown}
      onKeyUp={setOffsetRef}
    >
      {crdtRef.current && crdtRef.current.read()}
    </p>
  );
}

export default Editor;
