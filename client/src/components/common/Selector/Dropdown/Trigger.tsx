import { useDropdownContext } from 'src/hooks/useDropdownContext';

interface TriggerProps {
  trigger: JSX.Element;
}

function Trigger({ trigger }: TriggerProps) {
  const { setIsOpen } = useDropdownContext();

  return (
    <div
      onClick={() => {
        setIsOpen((isOpen) => !isOpen);
      }}
    >
      {trigger}
    </div>
  );
}

export default Trigger;
