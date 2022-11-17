import { useContext } from 'react';
import DropdownContext from 'src/contexts/dropdown';

export function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context)
    throw new Error(
      'DropdownContext는 정의된 스코프 안에서만 사용 가능해요 ^^',
    );

  return context;
}
