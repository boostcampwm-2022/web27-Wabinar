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

  return {
    offsetRef,
    setOffset,
    clearOffset,
  };
}
