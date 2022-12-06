import {
  RemoteInsertOperation,
  RemoteDeleteOperation,
} from '@wabinar/crdt/linked-list';
import { useEffect, useRef, memo } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import { useCRDT } from 'src/hooks/useCRDT';
import { useOffset } from 'src/hooks/useOffset';
import useSocketContext from 'src/hooks/useSocketContext';

import ee from '../EventEmitter';

interface BlockProps {
  id: string;
  index: number;
  onKeyDown: React.KeyboardEventHandler;
}

function Block({ id, onKeyDown, index }: BlockProps) {
  const { momSocket: socket } = useSocketContext();

  const {
    syncCRDT,
    readCRDT,
    localInsertCRDT,
    localDeleteCRDT,
    remoteInsertCRDT,
    remoteDeleteCRDT,
  } = useCRDT();

  const blockRef = useRef<HTMLParagraphElement>(null);

  const { offsetRef, setOffset, clearOffset, offsetHandlers } =
    useOffset(blockRef);

  // 로컬에서 일어나는 작성 - 삽입과 삭제 연산
  const onInput: React.FormEventHandler = (e) => {
    setOffset();

    if (offsetRef.current === null) return;

    console.log('input', offsetRef.current);

    const event = e.nativeEvent as InputEvent;

    if (event.isComposing) return; // 한글 입력 무시

    if (event.inputType === 'deleteContentBackward') {
      const remoteDeletion = localDeleteCRDT(offsetRef.current);

      socket.emit(SOCKET_MESSAGE.BLOCK.DELETE_TEXT, id, remoteDeletion);
      return;
    }

    const letter = event.data as string;

    if (!letter) return;

    const previousLetterIndex = offsetRef.current - 2;

    const remoteInsertion = localInsertCRDT(previousLetterIndex, letter);

    socket.emit(SOCKET_MESSAGE.BLOCK.INSERT_TEXT, id, remoteInsertion);
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
    socket.emit(SOCKET_MESSAGE.BLOCK.INIT, id);

    const onInitialize = (crdt: unknown) => {
      syncCRDT(crdt);

      if (!blockRef.current) return;

      blockRef.current.innerText = readCRDT();
      blockRef.current.contentEditable = 'true';
    };

    const onInsert = (op: RemoteInsertOperation) => {
      const prevIndex = remoteInsertCRDT(op);

      if (!blockRef.current) return;

      blockRef.current.innerText = readCRDT();

      if (prevIndex === null || offsetRef.current === null) return;

      updateCaretPosition(Number(prevIndex < offsetRef.current));
    };

    const onDelete = (op: RemoteDeleteOperation) => {
      const targetIndex = remoteDeleteCRDT(op);

      if (!blockRef.current) return;

      blockRef.current.innerText = readCRDT();

      if (targetIndex === null || offsetRef.current === null) return;

      updateCaretPosition(-Number(targetIndex <= offsetRef.current));
    };

    ee.on(`${SOCKET_MESSAGE.BLOCK.INIT}-${id}`, onInitialize);
    ee.on(`${SOCKET_MESSAGE.BLOCK.UPDATE_TEXT}-${id}`, onInitialize);
    ee.on(`${SOCKET_MESSAGE.BLOCK.INSERT_TEXT}-${id}`, onInsert);
    ee.on(`${SOCKET_MESSAGE.BLOCK.DELETE_TEXT}-${id}`, onDelete);

    return () => {
      ee.off(`${SOCKET_MESSAGE.BLOCK.INIT}-${id}`, onInitialize);
      ee.off(`${SOCKET_MESSAGE.BLOCK.UPDATE_TEXT}-${id}`, onInitialize);
      ee.off(`${SOCKET_MESSAGE.BLOCK.INSERT_TEXT}-${id}`, onInsert);
      ee.off(`${SOCKET_MESSAGE.BLOCK.DELETE_TEXT}-${id}`, onDelete);
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

      socket.emit('text-insertion', id, remoteInsertion);
    });
  };

  const onPaste: React.ClipboardEventHandler<HTMLParagraphElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLParagraphElement;
    if (offsetRef.current === null) return;
    if (!blockRef.current) return;

    console.log('붙여넣기 전', offsetRef.current);

    let previousLetterIndex = offsetRef.current - 1;
    const previousText = blockRef.current.innerText.slice(
      0,
      previousLetterIndex + 1,
    );
    const nextText = blockRef.current.innerText.slice(previousLetterIndex + 1);

    console.log(previousText, ':', nextText);

    const pastedText = e.clipboardData.getData('text/plain');
    const remoteInsertions = pastedText
      .replace('\n', '')
      .split('')
      .map((letter) => localInsertCRDT(previousLetterIndex++, letter));

    socket.emit(SOCKET_MESSAGE.BLOCK.UPDATE_TEXT, id, remoteInsertions);

    blockRef.current.innerText = previousText + pastedText + nextText;
    updateCaretPosition(pastedText.length);
    console.log('붙여넣기 후', offsetRef.current);
  };

  const onKeyDownComposite: React.KeyboardEventHandler<HTMLParagraphElement> = (
    e,
  ) => {
    offsetHandlers.onKeyDown(e);
    onKeyDown(e);
  };

  return (
    <p
      ref={blockRef}
      data-id={id}
      data-index={index}
      onInput={onInput}
      onCompositionEnd={onCompositionEnd}
      {...offsetHandlers}
      onKeyDown={onKeyDownComposite}
      onPaste={onPaste}
      suppressContentEditableWarning={true}
    >
      {readCRDT()}
    </p>
  );
}

export default memo(Block);
