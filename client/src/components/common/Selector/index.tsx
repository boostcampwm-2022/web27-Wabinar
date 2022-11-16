import React from 'react';

import Dropdown from '../Dropdown';

interface SelectorProps {
  trigger: JSX.Element;
  options: string[];
  onChange: () => void;
}

function Selector({ trigger, options, onChange }: SelectorProps) {
  return (
    <Dropdown onChange={onChange}>
      <Dropdown.Trigger trigger={trigger}></Dropdown.Trigger>
      <Dropdown.Menu>
        {options.map((option, idx) => (
          <Dropdown.Item key={idx}>{option}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Selector;
