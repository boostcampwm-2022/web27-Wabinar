import { useDropdownContext } from './DropdownContext';

interface MenuProps {
  children: React.ReactNode;
  className: string;
}

function Menu({ children, className }: MenuProps) {
  const { isOpen } = useDropdownContext();

  return <>{isOpen && <ul className={className}>{children}</ul>}</>;
}

export default Menu;
