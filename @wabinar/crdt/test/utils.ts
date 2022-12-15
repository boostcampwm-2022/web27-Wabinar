import CRDT from '../index';
import { RemoteInsertOperation } from '../linked-list';
import { Node } from '../node';

/**
 * 모든 remote site 문자열이 일치하는지 확인
 */
export const convergenceCheck = (remoteSites) => {
  const convergenceSet = remoteSites.reduce((prev, cur, index) => {
    if (index < remoteSites.length - 1) {
      prev.push([cur, remoteSites[index + 1]]);
    }

    return prev;
  }, []);

  convergenceSet.forEach(([first, second]) => {
    expect(first.read()).toEqual(second.read());
  });
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
