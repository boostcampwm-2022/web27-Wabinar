import {
  원희,
  주영,
  도훈,
  세영,
  convergenceCheck,
  remoteInsertThroughSocket,
} from './utils';

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

  it('여러 site에서 같은 위치 삭제', () => {
    const 도훈remote = 도훈.localDelete(0);
    const 세영remote = 세영.localDelete(0);

    도훈.remoteDelete(세영remote);
    세영.remoteDelete(도훈remote);

    [원희, 주영].forEach((나) => {
      나.remoteDelete(세영remote);
      나.remoteDelete(도훈remote);
    });

    convergenceCheck();
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

    convergenceCheck();
  });
});
