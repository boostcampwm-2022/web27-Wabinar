import CRDT from '../index';
import LinkedList from '../linked-list';
import { RemoteInsertOperation } from '../linked-list';
import { Node } from '../node';

/**
 * 테스트용 site들
 * 인스턴스를 재사용하기 때문에 테스트 케이스 간 의존성 존재
 */
export const 원희 = new CRDT(1, new LinkedList());
export const 주영 = new CRDT(2, new LinkedList());
export const 도훈 = new CRDT(3, new LinkedList());
export const 세영 = new CRDT(4, new LinkedList());

/**
 * 모든 remote site 문자열이 일치하는지 확인
 */
export const convergenceCheck = () => {
  expect(원희.read()).toEqual(주영.read());
  expect(주영.read()).toEqual(도훈.read());
  expect(도훈.read()).toEqual(세영.read());
};

/**
 * 바로 전달하면 같은 인스턴스를 가리키게 되어 remote operation 의미가 사라짐
 */
const deepCopyRemoteInsertion = (op: RemoteInsertOperation) => {
  const { node } = op;

  const copy = { ...node };
  Object.setPrototypeOf(copy, Node.prototype);

  return { node: copy as Node };
};

export const remoteInsertThroughSocket = (
  crdt: CRDT,
  op: RemoteInsertOperation,
) => {
  const copy = deepCopyRemoteInsertion(op);
  crdt.remoteInsert(copy);
};
