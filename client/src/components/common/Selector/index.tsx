/* eslint-disable @typescript-eslint/no-explicit-any */

import Dropdown from '../Dropdown';

interface SelectorOption {
  id: number;
  option: React.ReactNode;
}

interface SelectorProps {
  trigger: JSX.Element;
  options: SelectorOption[];
  onChange: (args: any) => void;
}

function Selector({ trigger, options, onChange }: SelectorProps) {
  return (
    <Dropdown onChange={onChange}>
      <Dropdown.Trigger trigger={trigger}></Dropdown.Trigger>
      <Dropdown.Menu>
        {options.map(({ id, option }) => (
          <Dropdown.Item key={id} id={id}>
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Selector;
