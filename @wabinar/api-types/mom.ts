import LinkedList, {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from '@wabinar/crdt/linked-list';

export type Mom = {
  _id: string;
  title: string;
  createdAt: Date;
};

export interface Created {
  mom: Mom;
}

export interface Select {
  id: string;
}

export interface Selected {
  mom: Mom;
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
