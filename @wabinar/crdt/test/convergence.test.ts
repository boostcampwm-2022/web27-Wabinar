import CRDT from '../index';
import LinkedList from '../linked-list';
import { convergenceCheck, remoteInsertThroughSocket } from './utils';

/**
 * 테스트용 site들
 * 인스턴스를 재사용하기 때문에 테스트 케이스 간 의존성 존재
 */
const 원희 = new CRDT(1, new LinkedList());
const 주영 = new CRDT(2, new LinkedList());
const 도훈 = new CRDT(3, new LinkedList());
const 세영 = new CRDT(4, new LinkedList());

const remoteSites = [원희, 주영, 도훈, 세영];

describe('Convergence', () => {
  it('하나의 site에서 삽입', () => {
    const 원희remotes = [
      원희.localInsert(-1, '녕'),
      원희.localInsert(-1, '안'),
    ];

    [주영, 도훈, 세영].forEach((나) => {
      원희remotes.forEach((op) => remoteInsertThroughSocket(나, op));
    });

    convergenceCheck(remoteSites);
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

    convergenceCheck(remoteSites);
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

    convergenceCheck(remoteSites);
  });

  it('여러 site에서 같은 위치 삭제', () => {
    const 도훈remote = 도훈.localDelete(0);
    const 세영remote = 세영.localDelete(0);

    도훈.remoteDelete(세영remote);
    세영.remoteDelete(도훈remote);

    [원희, 주영].forEach((나) => {
      나.remoteDelete(세영remote);
      나.remoteDelete(도훈remote);
    });

    convergenceCheck(remoteSites);
  });

  it('여러 site에서 다른 위치 삭제', () => {
    const 원희remote = 원희.localDelete(0);
    const 주영remote = 주영.localDelete(2);

    원희.remoteDelete(주영remote);
    주영.remoteDelete(원희remote);

    [도훈, 세영].forEach((나) => {
      나.remoteDelete(원희remote);
      나.remoteDelete(주영remote);
    });

    convergenceCheck(remoteSites);
  });
});
