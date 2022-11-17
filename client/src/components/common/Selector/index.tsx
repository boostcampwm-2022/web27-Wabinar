import { SelectorProps } from 'src/types/selector';

import Dropdown from './Dropdown';

function Selector({ TriggerElement, options, onChange, style }: SelectorProps) {
  return (
    <Dropdown onChange={onChange}>
      <Dropdown.Trigger TriggerElement={TriggerElement}></Dropdown.Trigger>
      <Dropdown.Menu style={style}>
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
