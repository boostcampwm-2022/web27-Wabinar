import CRDT from '../index';
import LinkedList from '../linked-list';
import { remoteInsertThroughSocket } from './utils';

describe('Exceptions', () => {
  let 도훈, 호둔, remoteSites;

  beforeEach(() => {
    도훈 = new CRDT(1, new LinkedList());
    호둔 = new CRDT(2, new LinkedList());

    remoteSites = [도훈, 호둔];

    const 도훈remotes = [
      도훈.localInsert(-1, '녕'),
      도훈.localInsert(-1, '안'),
    ];
    도훈remotes.forEach((op) => remoteInsertThroughSocket(호둔, op));
  });

  it('존재하지 않는 인덱스에 localInsert', () => {
    expect(() => 도훈.localInsert(100, '.')).toThrow();
  });

  it('존재하지 않는 인덱스에 remoteInsert', () => {
    const 도훈remotes = [
      도훈.localInsert(1, '.'),
      도훈.localInsert(2, '.'),
      도훈.localInsert(3, '.'),
    ];

    // 연속된 remote operation 순서가 섞이는 케이스
    expect(() => 호둔.remoteInsert(도훈remotes[1])).toThrow();
  });

  it('local에서 삭제된 노드 뒤에 삽입', () => {
    const 도훈remote = 도훈.localInsert(0, '!');
    const 호둔remote = 호둔.localDelete(0);

    expect(() => 호둔.remoteInsert(도훈remote)).toThrow();
  });
});
