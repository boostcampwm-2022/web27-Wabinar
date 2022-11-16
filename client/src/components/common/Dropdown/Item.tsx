import { useDropdownContext } from './DropdownContext';

interface ItemProps {
  id: number;
  children: React.ReactNode;
}

function Item({ id, children }: ItemProps) {
  const { setIsOpen, onChange } = useDropdownContext();

  const onSelect = () => {
    onChange(id);
    setIsOpen(false);
  };

  return <div onClick={onSelect}>{children}</div>;
}

export default Item;
