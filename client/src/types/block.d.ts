export type VoteMode = 'create' | 'registered' | 'end';

export interface Option {
  id: number;
  text: string;
  count: number;
}
