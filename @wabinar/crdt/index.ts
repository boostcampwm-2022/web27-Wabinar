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

    this.structure = new LinkedList(initialStructure);

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

  localInsert(index: number, value: string): RemoteInsertOperation {
    const id = new Identifier(this.clock++, this.client);
    try {
      const remoteInsertion = this.structure.insertByIndex(index, value, id);

      return remoteInsertion;
    } catch (e) {
      throw e;
    }
  }

  localDelete(index: number): RemoteDeleteOperation {
    try {
      const targetId = this.structure.deleteByIndex(index);

      return { targetId, clock: this.clock };
    } catch (e) {
      throw e;
    }
  }

  remoteInsert({ node }: RemoteInsertOperation) {
    try {
      const prevIndex = this.structure.insertById(node);

      if (++this.clock < node.id.clock) {
        this.clock = node.id.clock + 1;
      }

      return prevIndex;
    } catch (e) {
      throw e;
    }
  }

  remoteDelete({ targetId, clock }: RemoteDeleteOperation) {
    try {
      const targetIndex = this.structure.deleteById(targetId);

      if (++this.clock < clock) {
        this.clock = clock + 1;
      }

      return targetIndex;
    } catch (e) {
      throw e;
    }
  }

  read() {
    return this.structure.stringify();
  }

  spread() {
    return this.structure.spread();
  }
}

export default CRDT;
