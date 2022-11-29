import CRDT from './index';
import LinkedList, { RemoteInsertOperation } from './linked-list';
import { Node } from './node';

/**
 * utilities
 * 바로 전달하면 같은 인스턴스를 가리키게 되어 remote operation 의미가 사라짐
 */
const deepCopyRemoteInsertion = (op: RemoteInsertOperation) => {
  const { node } = op;

  const copy = { ...node };
  Object.setPrototypeOf(copy, Node.prototype);

  return { node: copy as Node };
};

const remoteInsertThroughSocket = (crdt: CRDT, op: RemoteInsertOperation) => {
  const copy = deepCopyRemoteInsertion(op);
  crdt.remoteInsert(copy);
};

/**
 * 모든 remote site 문자열이 일치하는지 확인
 */
const convergenceCheck = () => {
  expect(원희.read()).toEqual(주영.read());
  expect(주영.read()).toEqual(도훈.read());
  expect(도훈.read()).toEqual(세영.read());
};

/**
 * 테스트용 site들
 */
const 원희 = new CRDT(1, 1, new LinkedList());
const 주영 = new CRDT(1, 2, new LinkedList());
const 도훈 = new CRDT(1, 3, new LinkedList());
const 세영 = new CRDT(1, 4, new LinkedList());

describe('Convergence', () => {
  it('하나의 site에서 삽입', () => {
    const 원희remotes = [
      원희.localInsert(-1, '녕'),
      원희.localInsert(-1, '안'),
    ];

    [주영, 도훈, 세영].forEach((나) => {
      원희remotes.forEach((op) => remoteInsertThroughSocket(나, op));
    });

    convergenceCheck();
  });

  it('여러 site에서 같은 위치에 삽입', () => {
    const 도훈remote = 도훈.localInsert(0, '왭');
    const 세영remote = 세영.localInsert(0, '?');

    remoteInsertThroughSocket(도훈, 세영remote);
    remoteInsertThroughSocket(세영, 도훈remote);

    [원희, 주영].forEach((나) => {
      remoteInsertThroughSocket(나, 도훈remote);
      remoteInsertThroughSocket(나, 세영remote);
    });

    convergenceCheck();
  });

  it('여러 site에서 다른 위치에 삽입', () => {
    const 원희remote = 원희.localInsert(0, '네');
    const 주영remote = 주영.localInsert(1, '!');

    remoteInsertThroughSocket(원희, 주영remote);
    remoteInsertThroughSocket(주영, 원희remote);

    [도훈, 세영].forEach((나) => {
      remoteInsertThroughSocket(나, 원희remote);
      remoteInsertThroughSocket(나, 주영remote);
    });

    convergenceCheck();
  });
});
