import LinkedList, {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from './linked-list';
import { Identifier } from './node';

class CRDT {
  private clock: number;
  private client: number;
  private structure: LinkedList;

  constructor(
    initialclock: number = 1,
    client: number = 0,
    initialStructure: LinkedList,
  ) {
    this.clock = initialclock;
    this.client = client;

    Object.setPrototypeOf(initialStructure, LinkedList.prototype);
    this.structure = initialStructure as LinkedList;
  }

  get data() {
    return this.structure;
  }

  localInsert(index: number, letter: string): RemoteInsertOperation {
    const id = new Identifier(this.clock++, this.client);

    const remoteInsertion = this.structure.insertByIndex(index, letter, id);

    return remoteInsertion;
  }

  localDelete(index: number): RemoteDeleteOperation {
    const targetId = this.structure.deleteByIndex(index);

    return { targetId, clock: this.clock };
  }

  remoteInsert({ prevId, node }: RemoteInsertOperation) {
    const prevIndex = this.structure.insertById(prevId, node);

    if (++this.clock < node.id.clock) {
      this.clock = node.id.clock + 1;
    }

    return prevIndex;
  }

  remoteDelete({ targetId, clock }: RemoteDeleteOperation) {
    const targetIndex = this.structure.deleteById(targetId);

    if (++this.clock < clock) {
      this.clock = clock + 1;
    }

    return targetIndex;
  }

  read() {
    return this.structure.stringify();
  }
}

export default CRDT;
