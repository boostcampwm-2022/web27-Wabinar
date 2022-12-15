import { BlockType } from '@wabinar/constants/block';
import LinkedList, {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from '@wabinar/crdt/linked-list';

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

export interface InitText {
  id: string;
}

export interface InitializedText {
  id: string;
  crdt: LinkedList;
}

export interface InsertText {
  id: string;
  op: RemoteInsertOperation;
}

export interface InsertedText {
  id: string;
  op: RemoteInsertOperation;
}

export interface DeleteText {
  id: string;
  op: RemoteDeleteOperation;
}

export interface DeletedText {
  id: string;
  op: RemoteDeleteOperation;
}

export interface UpdateText {
  id: string;
  ops: RemoteInsertOperation[];
}

export interface UpdatedText {
  id: string;
  crdt: LinkedList;
}
