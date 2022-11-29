import { useEffect, useRef } from 'react';
import { useCRDT } from 'src/hooks/useCRDT';
import { useOffset } from 'src/hooks/useOffset';
import useSocketContext from 'src/hooks/useSocketContext';

import style from './style.module.scss';

function Editor() {
  const { momSocket: socket } = useSocketContext();

  const {
    syncCRDT,
    readCRDT,
    localInsertCRDT,
    localDeleteCRDT,
    remoteInsertCRDT,
    remoteDeleteCRDT,
  } = useCRDT();

  const { offsetRef, setOffset, clearOffset, offsetHandlers } = useOffset();

  const blockRef = useRef<HTMLParagraphElement>(null);

  // 로컬에서 일어나는 작성 - 삽입과 삭제 연산
  const onInput: React.FormEventHandler = (e) => {
    setOffset();

    if (offsetRef.current === null) return;

    const event = e.nativeEvent as InputEvent;

    if (event.isComposing) return; // 한글 입력 무시

    if (event.inputType === 'deleteContentBackward') {
      const remoteDeletion = localDeleteCRDT(offsetRef.current);

      socket.emit('mom-deletion', remoteDeletion);
      return;
    }

    const letter = event.data as string;

    const previousLetterIndex = offsetRef.current - 2;

    const remoteInsertion = localInsertCRDT(previousLetterIndex, letter);

    socket.emit('mom-insertion', remoteInsertion);
  };

  // 리모트 연산 수행결과로 innerText 변경 시 커서의 위치 조정
  const updateCaretPosition = (updateOffset = 0) => {
    if (!blockRef.current || offsetRef.current === null) return;

    const selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();

    const range = new Range();

    // 우선 블럭의 첫번째 text node로 고정, text node가 없는 경우 clearOffset()
    if (!blockRef.current.firstChild) {
      clearOffset();
      return;
    }

    // range start와 range end가 같은 경우만 가정
    range.setStart(
      blockRef.current.firstChild,
      offsetRef.current + updateOffset,
    );
    range.collapse();
    selection.addRange(range);

    // 변경된 offset 반영
    setOffset();
  };

  // crdt의 초기화와 소켓을 통해 전달받는 리모트 연산 처리
  useEffect(() => {
    socket.emit('mom-initialization');
    
    socket.on('mom-initialization', (crdt) => {
      syncCRDT(crdt);

      if (!blockRef.current) return;

      blockRef.current.innerText = readCRDT();
      blockRef.current.contentEditable = 'true';
    });

    socket.on('mom-insertion', (op) => {
      const prevIndex = remoteInsertCRDT(op);

      if (!blockRef.current) return;

      blockRef.current.innerText = readCRDT();

      if (prevIndex === null || offsetRef.current === null) return;

      updateCaretPosition(Number(prevIndex < offsetRef.current));
    });

    socket.on('mom-deletion', (op) => {
      const targetIndex = remoteDeleteCRDT(op);

      if (!blockRef.current) return;

      blockRef.current.innerText = readCRDT();

      if (targetIndex === null || offsetRef.current === null) return;

      updateCaretPosition(-Number(targetIndex <= offsetRef.current));
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  // 한글 입력 핸들링
  const onCompositionEnd: React.CompositionEventHandler = (e) => {
    const event = e.nativeEvent as CompositionEvent;

    // compositionend 이벤트가 공백 문자로 발생하는 경우가 있음
    const letters = (event.data as string).split('');
    const maxIndex = letters.length - 1;

    letters.forEach((letter, idx) => {
      if (offsetRef.current === null) return;

      const previousLetterIndex = offsetRef.current - 2 - (maxIndex - idx);

      const remoteInsertion = localInsertCRDT(previousLetterIndex, letter);

      socket.emit('mom-insertion', remoteInsertion);
    });
  };

  // 블럭 한개 가정을 위한 임시 핸들러
  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      console.log('새 블럭이 생길거에요 ^^');
    }
  };

  return (
    <p
      ref={blockRef}
      onInput={onInput}
      onCompositionEnd={onCompositionEnd}
      {...offsetHandlers}
      onKeyDown={onKeyDown}
      className={style['editor-container']}
      suppressContentEditableWarning={true}
    >
      {readCRDT()}
    </p>
  );
}

export default Editor;
