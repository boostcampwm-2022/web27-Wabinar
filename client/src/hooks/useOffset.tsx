import { useRef } from 'react';

export function useOffset() {
  const offsetRef = useRef<number | null>(null);

  const setOffset = () => {
    const selection = window.getSelection();

    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);

      offsetRef.current = range.startOffset;
    }
  };

  const clearOffset = () => {
    offsetRef.current = null;
  };

  const onKeyUp: React.KeyboardEventHandler = (e) => {
    const arrowKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];

    if (arrowKeys.includes(e.nativeEvent.key)) {
      setOffset();
    }
  };

  const offsetHandlers = {
    onFocus: setOffset,
    onClick: setOffset,
    onBlur: clearOffset,
    onKeyUp: onKeyUp,
  };

  return {
    offsetRef,
    setOffset,
    clearOffset,
    offsetHandlers,
  };
}
