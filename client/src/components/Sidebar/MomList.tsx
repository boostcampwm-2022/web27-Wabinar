import { TMom } from 'src/types/mom';

import style from './style.module.scss';

interface MomListProps {
  moms: TMom[];
}

function MomList({ moms }: MomListProps) {
  return (
    <div className={style['mom-list-container']}>
      <h2>회의록</h2>
      <ul className={style['mom-list']}>
        {moms.map((item) => (
          <li key={item._id}>{item._id}</li>
        ))}
      </ul>
      <button>+ 회의록 추가</button>
    </div>
  );
}

export default MomList;
