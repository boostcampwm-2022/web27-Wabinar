import { Identifier, Node } from './node';

type RemoteIdentifier = Identifier | null;

type ModifiedIndex = number | null;

export default class LinkedList {
  private head?: Node;

  insertByIndex(index: number, node: Node): RemoteIdentifier {
    try {
      if (!this.head || index === -1) {
        node.next = this.head;
        this.head = node;

        return null;
      }
      const prevNode = this.findByIndex(index);

      node.next = prevNode.next;
      prevNode.next = node;

      const { id: prevNodeId } = prevNode;
      return prevNodeId;
    } catch (e) {
      console.log(`insertByIndex 실패 ^^\n${e}`);

      return null;
    }
  }

  deleteByIndex(index: number): RemoteIdentifier {
    try {
      if (!index) {
        if (!this.head) throw new Error('head가 없는데 어떻게 삭제하셨나요 ^^');

        this.head = this.head.next;

        return null;
      }

      const prevNode = this.findByIndex(index - 1);

      const targetNode = prevNode.next;

      prevNode.next = targetNode?.next;

      if (!targetNode || !targetNode.id) return null;

      return targetNode.id;
    } catch (e) {
      console.log(`deleteByIndex 실패 ^^\n${e}`);

      return null;
    }
  }

  insertById(id: RemoteIdentifier, node: Node): ModifiedIndex {
    try {
      if (id === null) {
        node.next = this.head;
        this.head = node;

        return 0;
      }

      const { node: prevNode, index: prevIndex } = this.findById(id);

      node.next = prevNode.next;
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
    if (!this.head) {
      return '';
    }

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
