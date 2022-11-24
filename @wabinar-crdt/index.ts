import LinkedList from './linked-list';
import { Identifier, Node } from './node';

interface RemoteInsertOperation {
  prevId: Identifier | null;
  node: Node;
}

interface RemoteRemoveOperation {
  targetId: Identifier | null;
  clock: number;
}

class CRDT {
  private clock: number;
  private client: number;
  private structure: LinkedList;

  constructor(initialclock: number, client: number) {
    this.clock = initialclock;
    this.client = client;
    this.structure = new LinkedList();
  }

  setClientId(id: number) {
    this.client = id;
    Object.setPrototypeOf(this.structure, LinkedList.prototype);
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

  localDelete(index: number): RemoteRemoveOperation {
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

  remoteDelete({ targetId, clock }: RemoteRemoveOperation) {
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
