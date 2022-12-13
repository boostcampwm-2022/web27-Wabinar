import CRDT from '../index';
import LinkedList from '../linked-list';

describe('Local operation', () => {
  const initialStructure = new LinkedList();

  const 나 = new CRDT(1, initialStructure);

  it('head에 삽입', () => {
    let innerText = 나.read();

    나.localInsert(-1, '녕');
    expect(나.read()).toEqual('녕' + innerText);

    innerText = 나.read();

    나.localInsert(-1, '안');
    expect(나.read()).toEqual('안' + innerText);
  });

  it('tail에 삽입', () => {
    let innerText = 나.read();

    나.localInsert(1, '하');
    expect(나.read()).toEqual(innerText + '하');
  });

  it('head 삭제', () => {
    let innerText = 나.read();

    나.localDelete(0);
    expect(나.read()).toEqual(innerText.replace('안', ''));
  });
});
