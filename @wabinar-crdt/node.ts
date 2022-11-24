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

  constructor(value: string, id: Identifier) {
    this.id = id;
    this.value = value;
  }

  precedes(id: Identifier) {
    if (this.id.clock < id.clock) return true;

    if (this.id.clock === id.clock && this.id.client < id.client) return true;

    return false;
  }
}
