import style from './style.module.scss';

function MomList() {
  const moms = [
    { id: 1, name: '회의록 1' },
    { id: 2, name: '회의록 2' },
    { id: 3, name: '회의록 3' },
  ];

  return (
    <div className={style['mom-list-container']}>
      <h2>회의록</h2>
      <ul className={style['mom-list']}>
        {moms.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button>+ 회의록 추가</button>
    </div>
  );
}

export default MomList;
