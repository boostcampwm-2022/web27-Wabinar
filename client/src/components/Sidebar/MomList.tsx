import style from './style.module.scss';

function MomList() {
  const moms = [
    { id: 1, name: '회의록 1' },
    { id: 2, name: '회의록 2' },
    { id: 3, name: '회의록 3' },
  ];

  return (
    <div className={style['mom-list']}>
      <h2>회의록</h2>
      {moms.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
      <p>+ 회의록 추가</p>
    </div>
  );
}

export default MomList;
