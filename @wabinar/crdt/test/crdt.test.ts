import CRDT from '../index';
import LinkedList from '../linked-list';

describe('CRDT Local operations', () => {
  let 나;

  beforeEach(() => {
    const initialStructure = new LinkedList();
    나 = new CRDT(1, initialStructure);
  });

  describe('localInsert()', () => {
    it('head 위치 삽입에 성공한다.', () => {
      // act
      나.localInsert(-1, '녕');
      나.localInsert(-1, '안');

      // assert
      expect(나.read()).toEqual('안녕');
    });

    it('tail 위치 삽입에 성공한다.', () => {
      // act
      나.localInsert(-1, '안');
      나.localInsert(0, '녕');

      // assert
      expect(나.read()).toEqual('안녕');
    });

    it('없는 위치에 삽입 시도 시 에러를 던진다.', () => {
      // arrange
      나.localInsert(-1, '안');

      // act & assert
      expect(() => 나.localInsert(1, '녕')).toThrow();
    });
  });

  describe('localDelete()', () => {
    it('tail 위치 삭제에 성공한다.', () => {
      // arrange
      나.localInsert(-1, '안');
      나.localInsert(0, '녕');

      // act
      나.localDelete(1);

      // assert
      expect(나.read()).toEqual('안');
    });

    it('없는 위치에 삭제 시도 시 에러를 던진다.', () => {
      // arrange
      나.localInsert(-1, '안');

      // act & assert
      expect(() => 나.localDelete(1)).toThrow();
    });
  });
});
