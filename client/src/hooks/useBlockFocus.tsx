import { useRef } from 'react';

function useBlockFocus(
  blockRefs: React.MutableRefObject<React.RefObject<HTMLElement>[]>,
) {
  const focusIndex = useRef<number>();

  const updateFocus = (idx: number) => {
    focusIndex.current = idx;
  };

  const setFocus = () => {
    if (!blockRefs.current || focusIndex.current === undefined) return;

    const idx = focusIndex.current;

    const targetBlock = blockRefs.current[idx];

    if (!targetBlock || !targetBlock.current) return;

    targetBlock.current.focus();
  };

  return { updateFocus, setFocus };
}

export default useBlockFocus;
