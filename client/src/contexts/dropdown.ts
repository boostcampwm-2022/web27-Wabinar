/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

interface IDropdownContext {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (args: any) => void;
}

const DropdownContext = createContext<IDropdownContext | null>(null);

export default DropdownContext;
