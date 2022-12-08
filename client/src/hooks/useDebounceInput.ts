import { useMemo } from 'react';
import { debounce } from 'src/lib/debounce';

export default function useDebounceInput<T>(setInput: (inputValue: T) => void) {
  return useMemo(
    () => debounce<T>((inputValue: T) => setInput(inputValue), 300),
    [],
  );
}
