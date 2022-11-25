import LinkedList from './linked-list';
import { Identifier, Node } from './node';

export interface RemoteInsertOperation {
  prevId: Identifier | null;
  node: Node;
}

export interface RemoteDeleteOperation {
  targetId: Identifier | null;
  clock: number;
}

class CRDT {
  private clock: number;
  private client: number;
  private structure: LinkedList;

  constructor(
    initialclock: number = 1,
    client: number = 0,
    initialStructure?: LinkedList,
  ) {
    this.clock = initialclock;
    this.client = client;
    this.structure = initialStructure ?? new LinkedList();
  }

  get data() {
    return this.structure;
  }

  generateNode(letter: string) {
    const id = this.generateIdentifier();
    return new Node(letter, id);
  }

  generateIdentifier() {
    return new Identifier(this.clock++, this.client);
  }

  localInsert(index: number, letter: string): RemoteInsertOperation {
    const node = this.generateNode(letter);
    const prevId = this.structure.insertByIndex(index, node);

    return { prevId, node };
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
