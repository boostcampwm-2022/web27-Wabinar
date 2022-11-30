import LinkedList, {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from './linked-list';
import { Identifier } from './node';

class CRDT {
  private clock: number;
  private client: number;
  private structure: LinkedList;

  constructor(client: number = 0, initialStructure: LinkedList) {
    this.client = client;

    Object.setPrototypeOf(initialStructure, LinkedList.prototype);
    this.structure = initialStructure as LinkedList;

    const { nodeMap } = initialStructure;

    if (!nodeMap || !Object.keys(nodeMap).length) {
      this.clock = 1;
      return this;
    }

    // logical clock 동기화를 위함
    const maxClock = Object.keys(nodeMap)
      .map((id) => Number(JSON.parse(id).clock))
      .reduce((prev, cur) => Math.max(prev, cur), 0);

    this.clock = maxClock + 1;
  }

  get timestamp() {
    return this.clock;
  }

  get data() {
    return this.structure;
  }

  get plainData() {
    // DB에 저장할 때 ref 제거하기 위함
    const stringifiedData = JSON.stringify(this.structure);

    return JSON.parse(stringifiedData);
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

  remoteInsert({ node }: RemoteInsertOperation) {
    const prevIndex = this.structure.insertById(node);

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
