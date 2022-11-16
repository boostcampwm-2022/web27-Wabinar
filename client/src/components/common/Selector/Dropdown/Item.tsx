import { useDropdownContext } from 'src/hooks/useDropdownContext';

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

  return <li onClick={onSelect}>{children}</li>;
}

export default Item;
