import React, { useRef } from 'react';

export function useOffset(blockRef: React.RefObject<HTMLParagraphElement>) {
  const offsetRef = useRef<number | null>(null);

  const setOffset = (offset = 0) => {
    if (!blockRef.current) return;

    const selection = window.getSelection();

    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);

      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(
        blockRef.current as HTMLParagraphElement,
      );
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const maxOffset = preCaretRange.toString().length;

      const nextOffset = range.startOffset + offset;

      offsetRef.current = Math.min(maxOffset, Math.max(0, nextOffset));
    }
  };

  const clearOffset = () => {
    offsetRef.current = null;
  };

  // keydown 이벤트는 키 입력의 내용 반영 이전에 발생
  const onArrowKeyDown: React.KeyboardEventHandler = (e) => {
    const ARROW_LEFT = 'ArrowLeft';
    const ARROW_RIGHT = 'ArrowRight';

    switch (e.nativeEvent.key) {
      case ARROW_LEFT:
        setOffset(-1);
        return;
      case ARROW_RIGHT:
        setOffset(1);
        return;
    }
  };

  // 위 아래 방향키 이동은 keyDown에서 핸들링하지 않음
  const onArrowKeyup: React.KeyboardEventHandler = (e) => {
    const ARROW_DOWN = 'ArrowDown';
    const ARROW_UP = 'ArrowUp';

    if ([ARROW_DOWN, ARROW_UP].includes(e.nativeEvent.key)) {
      setOffset();
    }
  };

  const offsetHandlers = {
    onClick:
      setOffset as unknown as React.MouseEventHandler<HTMLParagraphElement>,
    onKeyUp: onArrowKeyup,
  };

  return {
    offsetRef,
    setOffset,
    clearOffset,
    onArrowKeyDown,
    offsetHandlers,
  };
}
