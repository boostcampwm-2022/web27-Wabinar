import { Identifier, Node } from './node';

type RemoteIdentifier = Identifier | null;

type ModifiedIndex = number | null;

export interface RemoteInsertOperation {
  node: Node;
}

export interface RemoteDeleteOperation {
  targetId: Identifier | null;
  clock: number;
}

interface NodeMap {
  [index: string]: Node;
}

export default class LinkedList {
  head: Identifier | null;
  nodeMap: NodeMap;

  constructor(initialStructure?) {
    if (!initialStructure) {
      this.head = null;
      this.nodeMap = {};

      return this;
    }

    const { head, nodeMap } = initialStructure;

    this.head = head ?? null;

    if (!nodeMap && !Object.keys(nodeMap).length) {
      this.nodeMap = nodeMap ?? {};

      return this;
    }

    const nodeMapWithPrototype = Object.entries(nodeMap).reduce(
      (prev, [id, node]) => {
        Object.setPrototypeOf(node, Node.prototype);
        prev[id] = node;

        return prev;
      },
      {},
    );
    this.nodeMap = nodeMapWithPrototype;
  }

  insertByIndex(
    index: number,
    value: string,
    id: Identifier,
  ): RemoteInsertOperation {
    try {
      const node = new Node(value, id);
      this.setNode(id, node);

      // insertion to head
      if (!this.head || index === -1) {
        node.next = this.head;
        node.prev = null;

        this.head = id;

        return { node };
      }

      const prevNode = this.findByIndex(index);

      node.next = prevNode.next;
      prevNode.next = node.id;

      const { id: prevId } = prevNode;

      node.prev = prevId;

      return { node };
    } catch (e) {
      throw new Error(`insertByIndex 실패 ^^\n${e}`);
    }
  }

  deleteByIndex(index: number): RemoteIdentifier {
    try {
      // head deleted
      if (index === 0) {
        const head = this.getHeadNode();

        if (!head) throw new Error('head가 없는데 어떻게 삭제하셨나요 ^^');

        const nextNode = this.getNode(head.next);

        if (!nextNode) {
          this.head = null;

          return null;
        }

        nextNode.prev = null;

        this.deleteNode(head.id);
        this.head = head.next;

        return null;
      }

      const prevNode = this.findByIndex(index - 1);

      if (!prevNode.next) return null;

      const targetNode = this.getNode(prevNode.next);

      if (!targetNode) return null;

      this.deleteNode(targetNode.id);
      prevNode.next = targetNode.next;

      return targetNode.id;
    } catch (e) {
      throw new Error(`deleteByIndex 실패 ^^\n${e}`);
    }
  }

  insertById(node: Node): ModifiedIndex {
    try {
      Object.setPrototypeOf(node, Node.prototype);
      this.setNode(node.id, node);

      let prevNode, prevIndex;

      // insertion to head
      if (!node.prev) {
        const head = this.getHeadNode();

        // 기존 head가 없거나 현재 node가 선행하는 경우
        if (!head || node.precedes(head)) {
          node.next = this.head;
          this.head = node.id;

          return null;
        }

        prevNode = head;
        prevIndex = 0;
      } else {
        let { node: targetNode, index: targetIndex } = this.findById(node.prev);

        prevNode = targetNode;
        prevIndex = targetIndex;
      }

      if (!prevNode) return null;

      // prevNode에 연결된 노드가 현재 node에 선행하는 경우
      while (prevNode.next && this.getNode(prevNode.next)?.precedes(node)) {
        prevNode = this.getNode(prevNode.next);
        prevIndex++;

        if (!prevNode) return null;
      }

      node.next = prevNode.next;
      prevNode.next = node.id;

      node.prev = prevNode.id;

      return prevIndex + 1;
    } catch (e) {
      console.log(`insertById 실패 ^^\n${e}`);

      return null;
    }
  }

  deleteById(id: RemoteIdentifier): ModifiedIndex {
    try {
      if (!id) {
        const head = this.getHeadNode();

        if (!head) throw new Error('일어날 수 없는 일이 발생했어요 ^^');

        this.head = head.next;

        return null;
      }

      const { node: targetNode, index: targetIndex } = this.findById(id);
      const prevNode = this.findByIndex(targetIndex - 1);

      prevNode.next = targetNode.next;
      this.deleteNode(id);

      return targetIndex;
    } catch (e) {
      console.log(`deleteById 실패 ^^\n${e}`);

      return null;
    }
  }

  stringify(): string {
    let node: Node | null = this.getHeadNode();
    let result = '';

    while (node) {
      result += node.value;
      node = this.getNode(node.next);
    }

    return result;
  }

  spread(): string[] {
    let node: Node | null = this.getHeadNode();
    let result = [];

    while (node) {
      result.push(node.value);
      node = this.getNode(node.next);
    }

    return result;
  }

  private findByIndex(index: number): Node {
    let count = 0;
    let currentNode: Node | null = this.getHeadNode();

    while (count < index && currentNode) {
      currentNode = this.getNode(currentNode.next);
      count++;
    }

    if (!currentNode) throw new Error('없는 인덱스인데요 ^^');

    return currentNode;
  }

  private findById(id: Identifier) {
    let count = 0;
    let currentNode: Node | null = this.getHeadNode();

    while (currentNode) {
      if (JSON.stringify(currentNode.id) === JSON.stringify(id)) {
        return { node: currentNode, index: count };
      }

      currentNode = this.getNode(currentNode.next);
      count++;
    }

    throw new Error('없는 노드인데요 ^^');
  }

  private getNode(id: Identifier | null): Node | null {
    if (!id) return null;

    return this.nodeMap[JSON.stringify(id)];
  }

  private getHeadNode() {
    if (!this.head) return null;

    return this.getNode(this.head);
  }

  private setNode(id: Identifier, node: Node) {
    this.nodeMap[JSON.stringify(id)] = node;
  }

  private deleteNode(id: Identifier) {
    delete this.nodeMap[JSON.stringify(id)];
  }
}
