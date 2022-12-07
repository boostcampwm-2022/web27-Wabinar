import { useRef } from 'react';

function useBlockFocus(
  blockRefs: React.MutableRefObject<React.RefObject<HTMLElement>[]>,
) {
  const focusIndex = useRef<number>();

  const updateFocus = (idx: number | undefined) => {
    focusIndex.current = idx;
  };

  const setFocus = () => {
    if (!blockRefs.current || focusIndex.current === undefined) return;

    const idx = focusIndex.current;

    const targetBlock = blockRefs.current[idx];

    if (!targetBlock || !targetBlock.current) return;

    targetBlock.current.focus();
  };

  const setCaretToEnd = () => {
    const selection = getSelection();

    if (!selection) return;

    const range = selection.getRangeAt(0);

    if (!range) return;

    range.selectNodeContents(range.startContainer);
    range.collapse();
  };

  return { updateFocus, setFocus, setCaretToEnd };
}

export default useBlockFocus;
