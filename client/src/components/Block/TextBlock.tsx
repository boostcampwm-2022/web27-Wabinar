/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* TextBlock 마운트 이후 항상 존재하는 blockRef.current 존재 여부 확인하는 불필요한 가드를 제거하기 위함 */

import * as BlockMessage from '@wabinar/api-types/block';
import { BlockType } from '@wabinar/constants/block';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from '@wabinar/crdt/linked-list';
import React, { memo, useEffect, useRef, useState } from 'react';
import BlockSelector from 'src/components/BlockSelector';
import useSocketContext from 'src/hooks/context/useSocketContext';
import { useCRDT } from 'src/hooks/useCRDT';
import { useOffset } from 'src/hooks/useOffset';

import ee from '../Mom/EventEmitter';

interface TextBlockProps {
  id: string;
  index: number;
  onHandleBlocks: React.KeyboardEventHandler;
  type: BlockType;
  setType: (arg: BlockType) => void;
  isLocalTypeUpdate: boolean;
  registerRef: (arg: React.RefObject<HTMLElement>) => void;
}

function TextBlock({
  id,
  index,
  onHandleBlocks,
  type,
  setType,
  isLocalTypeUpdate,
  registerRef,
}: TextBlockProps) {
  const { momSocket: socket } = useSocketContext();

  const initBlock = () => {
    const message: BlockMessage.InitText = { id };
    socket.emit(BLOCK_EVENT.INIT_TEXT, message);
  };

  const {
    syncCRDT,
    readCRDT,
    localInsertCRDT,
    localDeleteCRDT,
    remoteInsertCRDT,
    remoteDeleteCRDT,
  } = useCRDT();

  const blockRef = useRef<HTMLParagraphElement>(null);

  const { offsetRef, setOffset, clearOffset, onArrowKeyDown, offsetHandlers } =
    useOffset(blockRef);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);

  // 리모트 연산 수행결과로 innerText 변경 시 커서의 위치 조정
  const updateCaretPosition = (updateOffset = 0) => {
    if (offsetRef.current === null) return;

    const selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();

    const range = new Range();

    // 우선 블럭의 첫번째 text node로 고정, text node가 없는 경우 clearOffset()
    if (!blockRef.current!.firstChild) {
      clearOffset();
      return;
    }

    // range start와 range end가 같은 경우만 가정
    range.setStart(
      blockRef.current!.firstChild,
      offsetRef.current + updateOffset,
    );
    range.collapse();
    selection.addRange(range);

    // 변경된 offset 반영
    setOffset();
  };

  const onInitialize = (crdt: unknown) => {
    syncCRDT(crdt);

    blockRef.current!.innerText = readCRDT();

    updateCaretPosition();
  };

  const onInsert = (op: RemoteInsertOperation) => {
    let prevIndex;

    try {
      prevIndex = remoteInsertCRDT(op);
    } catch {
      initBlock();
      return;
    }

    blockRef.current!.innerText = readCRDT();

    if (prevIndex === null || offsetRef.current === null) return;

    updateCaretPosition(Number(prevIndex < offsetRef.current));
  };

  const onDelete = (op: RemoteDeleteOperation) => {
    let targetIndex;

    try {
      targetIndex = remoteDeleteCRDT(op);
    } catch {
      initBlock();
      return;
    }

    blockRef.current!.innerText = readCRDT();

    if (targetIndex === null || offsetRef.current === null) return;

    updateCaretPosition(-Number(targetIndex <= offsetRef.current));
  };

  // crdt의 초기화와 소켓을 통해 전달받는 리모트 연산 처리
  useEffect(() => {
    initBlock();

    ee.on(`${BLOCK_EVENT.INIT_TEXT}-${id}`, onInitialize);
    ee.on(`${BLOCK_EVENT.UPDATE_TEXT}-${id}`, onInitialize);
    ee.on(`${BLOCK_EVENT.INSERT_TEXT}-${id}`, onInsert);
    ee.on(`${BLOCK_EVENT.DELETE_TEXT}-${id}`, onDelete);

    return () => {
      ee.off(`${BLOCK_EVENT.INIT_TEXT}-${id}`, onInitialize);
      ee.off(`${BLOCK_EVENT.UPDATE_TEXT}-${id}`, onInitialize);
      ee.off(`${BLOCK_EVENT.INSERT_TEXT}-${id}`, onInsert);
      ee.off(`${BLOCK_EVENT.DELETE_TEXT}-${id}`, onDelete);
    };
  }, []);

  useEffect(() => {
    registerRef(blockRef);
    blockRef.current!.setAttribute('data-index', index.toString());
  }, [index]);

  useEffect(() => {
    updateCaretPosition();
  }, [isOpen]);

  useEffect(() => {
    if (isLocalTypeUpdate && readCRDT().length) {
      const remoteDeletion = localDeleteCRDT(0);

      const message: BlockMessage.DeleteText = { id, op: remoteDeletion };
      socket.emit(BLOCK_EVENT.DELETE_TEXT, message);

      blockRef.current!.innerText = readCRDT();
      blockRef.current!.focus();
    }
  }, [type]);

  // 로컬에서 일어나는 작성 - 삽입과 삭제 연산
  const onInput: React.FormEventHandler = (e) => {
    setOffset();

    if (blockRef.current!.innerText === '/') {
      setIsOpen(true);
    } else if (isOpen) {
      setIsOpen(false);
    }

    if (offsetRef.current === null) return;

    const event = e.nativeEvent as InputEvent;

    if (event.isComposing) return; // 한글 입력 무시

    if (event.inputType === 'deleteContentBackward') {
      let remoteDeletion;

      try {
        remoteDeletion = localDeleteCRDT(offsetRef.current);
      } catch {
        initBlock();
        return;
      }

      const message: BlockMessage.DeleteText = { id, op: remoteDeletion };
      socket.emit(BLOCK_EVENT.DELETE_TEXT, message);
      return;
    }

    const letter = event.data as string;
    const previousLetterIndex = offsetRef.current - 2;

    let remoteInsertion;

    try {
      remoteInsertion = localInsertCRDT(previousLetterIndex, letter);
    } catch {
      initBlock();
      return;
    }

    const message: BlockMessage.InsertText = { id, op: remoteInsertion };
    socket.emit(BLOCK_EVENT.INSERT_TEXT, message);
  };

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

      const message: BlockMessage.InsertText = { id, op: remoteInsertion };
      socket.emit(BLOCK_EVENT.INSERT_TEXT, message);
    });
  };

  const onPaste: React.ClipboardEventHandler<HTMLParagraphElement> = (e) => {
    e.preventDefault();

    setOffset();
    if (offsetRef.current === null) return;

    let previousLetterIndex = offsetRef.current - 1;
    const previousText = blockRef.current!.innerText.slice(
      0,
      previousLetterIndex + 1,
    );
    const nextText = blockRef.current!.innerText.slice(previousLetterIndex + 1);

    const pastedText = e.clipboardData.getData('text/plain').replace('\n', '');
    const remoteInsertions = pastedText
      .split('')
      .map((letter) => localInsertCRDT(previousLetterIndex++, letter));

    const message: BlockMessage.UpdateText = { id, ops: remoteInsertions };
    socket.emit(BLOCK_EVENT.UPDATE_TEXT, message);

    blockRef.current!.innerText = previousText + pastedText + nextText;
    updateCaretPosition(pastedText.length);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLParagraphElement> = (e) => {
    onArrowKeyDown(e);
    onHandleBlocks(e);
  };

  const commonHandlers = {
    onInput,
    onCompositionEnd,
    ...offsetHandlers,
    onKeyDown,
    onPaste,
  };

  const BLOCK_TYPES = Object.values(BlockType)
    .filter((el) => typeof el === 'string')
    .map((el) => (el as string).toLocaleLowerCase());

  const onSelect = (id: BlockType) => {
    setType(id);
    setIsOpen(false);
  };

  return (
    <>
      {React.createElement(
        BLOCK_TYPES[type],
        {
          ref: blockRef,
          'data-id': id,
          'data-index': index,
          ...commonHandlers,
          contentEditable: true,
          suppressContentEditableWarning: true,
        },
        readCRDT(),
      )}
      {isOpen && <BlockSelector onClose={onClose} onSelect={onSelect} />}
    </>
  );
}

export default memo(TextBlock);
