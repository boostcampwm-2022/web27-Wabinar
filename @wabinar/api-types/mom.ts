import LinkedList, {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from '@wabinar/crdt/linked-list';

export interface Created {
  mom: unknown;
}

export interface Select {
  id: string;
}

export interface Selected {
  mom: unknown;
}

export interface UpdateTitle {
  title: string;
}

export interface UpdatedTitle {
  title: string;
}

export interface Initialized {
  crdt: LinkedList;
}

export interface InsertBlock {
  blockId: string;
  op: RemoteInsertOperation;
}

export interface InsertedBlock {
  op: RemoteInsertOperation;
}

export interface DeleteBlock {
  blockId: string;
  op: RemoteDeleteOperation;
}

export interface DeletedBlock {
  op: RemoteDeleteOperation;
}
