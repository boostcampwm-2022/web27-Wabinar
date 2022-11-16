import { useContext, createContext } from 'react';

interface IDropdownContext {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (args: any) => void;
}

export const DropdownContext = createContext<IDropdownContext | null>(null);

export function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context)
    throw new Error(
      'DropdownContext는 정의된 스코프 안에서만 사용 가능해요 ^^',
    );

  return context;
}
