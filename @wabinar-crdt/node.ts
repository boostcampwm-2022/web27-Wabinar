export class Identifier {
  clock: number;
  client: number;

  constructor(clock: number, client: number) {
    this.clock = clock;
    this.client = client;
  }
}

export class Node {
  id: Identifier;
  value?: string;
  next?: Node;
  prev?: Identifier;

  constructor(value: string, id: Identifier) {
    this.id = id;
    this.value = value;
  }

  precedes(node: Node) {
    // prev가 다른 경우는 비교 대상에서 제외
    if (JSON.stringify(this.prev) !== JSON.stringify(node.prev)) return false;

    if (node.id.clock < this.id.clock) return true;

    if (this.id.clock === node.id.clock && this.id.client < node.id.client)
      return true;

    return false;
  }
}
