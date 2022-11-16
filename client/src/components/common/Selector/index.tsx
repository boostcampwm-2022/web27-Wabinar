import Dropdown from './Dropdown';
import { SelectorProps } from './types';

function Selector({ trigger, options, onChange, style }: SelectorProps) {
  return (
    <Dropdown onChange={onChange}>
      <Dropdown.Trigger trigger={trigger}></Dropdown.Trigger>
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
