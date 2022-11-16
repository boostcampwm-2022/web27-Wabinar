import { useDropdownContext } from './DropdownContext';

interface MenuProps {
  children: React.ReactNode;
}

function Menu({ children }: MenuProps) {
  const { isOpen } = useDropdownContext();

  return <>{isOpen && <div>{children}</div>}</>;
}

export default Menu;
