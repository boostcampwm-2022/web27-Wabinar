import { BlockType } from '@wabinar/constants/block';

export interface LoadType {
  id: string;
}

export interface LoadedType {
  type: BlockType;
}

export interface UpdateType {
  id: string;
  type: BlockType;
}

export interface UpdatedType {
  id: string;
  type: BlockType;
}
