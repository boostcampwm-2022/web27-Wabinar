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

export default class LinkedList {
  head?: Node;

  insertByIndex(
    index: number,
    letter: string,
    id: Identifier,
  ): RemoteInsertOperation {
    const node = new Node(letter, id);

    try {
      // insertion to head
      if (!this.head || index === -1) {
        node.next = this.head;
        node.prev = null;

        this.head = node;

        return { node };
      }

      const prevNode = this.findByIndex(index);

      node.next = prevNode.next;
      prevNode.next = node;

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
        if (!this.head) throw new Error('head가 없는데 어떻게 삭제하셨나요 ^^');

        if (!this.head.next) {
          this.head = undefined;
          return null;
        }

        this.head.next.prev = null;
        this.head = this.head.next;

        return null;
      }

      const prevNode = this.findByIndex(index - 1);

      const targetNode = prevNode.next;

      prevNode.next = targetNode?.next;

      if (!targetNode || !targetNode.id) return null;

      return targetNode.id;
    } catch (e) {
      throw new Error(`deleteByIndex 실패 ^^\n${e}`);
    }
  }

  insertById(node: Node): ModifiedIndex {
    try {
      let prevNode, prevIndex;

      // insertion to head
      if (node.prev === null) {
        // 기존 head가 없거나 현재 node가 선행하는 경우
        if (!this.head || node.precedes(this.head)) {
          node.next = this.head;
          this.head = node;

          return null;
        }

        prevNode = this.head;
        prevIndex = 0;
      } else {
        let { node: targetNode, index: targetIndex } = this.findById(node.prev);

        prevNode = targetNode;
        prevIndex = targetIndex;
      }

      // prevNode에 연결된 노드가 현재 node에 선행하는 경우
      while (prevNode.next && prevNode.next.precedes(node)) {
        prevNode = prevNode.next;
        prevIndex++;
      }

      node.next = prevNode.next;
      node.prev = prevNode.id;
      prevNode.next = node;

      return prevIndex + 1;
    } catch (e) {
      console.log(`insertById 실패 ^^\n${e}`);

      return null;
    }
  }

  deleteById(id: RemoteIdentifier): ModifiedIndex {
    try {
      if (!id) {
        if (!this.head) throw new Error('일어날 수 없는 일이 발생했어요 ^^');

        this.head = this.head.next;

        return null;
      }

      const { node: targetNode, index: targetIndex } = this.findById(id);
      const prevNode = this.findByIndex(targetIndex - 1);

      prevNode.next = targetNode.next;

      return targetIndex;
    } catch (e) {
      console.log(`deleteById 실패 ^^\n${e}`);

      return null;
    }
  }

  stringify(): string {
    let node: Node | undefined = this.head;
    let result = '';

    while (node) {
      result += node.value;
      node = node.next;
    }

    return result;
  }

  private findByIndex(index: number): Node {
    let count = 0;
    let currentNode: Node | undefined = this.head;

    while (count < index && currentNode) {
      currentNode = currentNode.next;
      count++;
    }

    if (!currentNode) throw new Error('없는 인덱스인데요 ^^');

    return currentNode;
  }

  private findById(id: Identifier) {
    let count = 0;
    let currentNode: Node | undefined = this.head;

    while (currentNode) {
      if (JSON.stringify(currentNode.id) === JSON.stringify(id)) {
        return { node: currentNode, index: count };
      }

      currentNode = currentNode.next;
      count++;
    }

    throw new Error('없는 노드인데요 ^^');
  }
}
