/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import { DropdownContext } from './DropdownContext';
import Item from './Item';
import Menu from './Menu';
import Trigger from './Trigger';

interface DropdownProps {
  children: React.ReactNode;
  onChange: (args: any) => void;
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

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;

export default Dropdown;
