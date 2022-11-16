import React, { useState, useContext, createContext } from 'react';

interface IDropdownContext {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (arg: any) => void;
}

const DropdownContext = createContext<IDropdownContext | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context)
    throw new Error(
      'DropdownContext는 정의된 스코프 안에서만 사용 가능해요 ^^',
    );

  return context;
}

interface DropdownProps {
  children: React.ReactNode;
  onChange: () => void;
}

function Dropdown({ children, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const value = {
    isOpen,
    setIsOpen,
    onChange,
  };

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
}

interface TriggerProps {
  trigger: JSX.Element;
}

function Trigger({ trigger }: TriggerProps) {
  const { setIsOpen } = useDropdownContext();

  return (
    <div
      onClick={() => {
        setIsOpen((isOpen) => !isOpen);
      }}
    >
      {trigger}
    </div>
  );
}

interface MenuProps {
  children: React.ReactNode;
}

function Menu({ children }: MenuProps) {
  const { isOpen } = useDropdownContext();

  return <>{isOpen && <div>{children}</div>}</>;
}

interface ItemProps {
  children: React.ReactNode;
}

function Item({ children }: ItemProps) {
  const { setIsOpen, onChange } = useDropdownContext();

  const onSelect = () => {
    onChange(children);
    setIsOpen(false);
  };

  return <div onClick={onSelect}>{children}</div>;
}

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;

export default Dropdown;
