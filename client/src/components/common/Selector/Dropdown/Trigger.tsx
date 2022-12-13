import React from 'react';
import useDropdownContext from 'src/hooks/context/useDropdownContext';

interface TriggerProps {
  TriggerElement: React.ElementType;
}

function Trigger({ TriggerElement }: TriggerProps) {
  const { setIsOpen } = useDropdownContext();

  const onToggleOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return <TriggerElement onClick={onToggleOpen} />;
}

export default Trigger;
