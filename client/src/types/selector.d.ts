/* eslint-disable @typescript-eslint/no-explicit-any */

interface SelectorOption {
  id: number;
  option: React.ReactNode;
}

export interface SelectorStyle {
  menu: string;
  dimmed: string;
}

export interface SelectorProps {
  TriggerElement: React.ElementType;
  options: SelectorOption[];
  onChange: (args: any) => void;
  style: SelectorStyle;
}
