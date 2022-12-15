import useDropdownContext from 'src/hooks/context/useDropdownContext';
import { SelectorStyle } from 'src/types/selector';

interface MenuProps {
  children: React.ReactNode;
  style: SelectorStyle;
}

function Menu({ children, style }: MenuProps) {
  const { isOpen, setIsOpen } = useDropdownContext();

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <>
          <ul className={style.menu}>{children}</ul>
          <div className={style.dimmed} onClick={onClose} />
        </>
      )}
    </>
  );
}

export default Menu;
