import { useState, useEffect } from 'react';
import useSocketContext from 'src/hooks/useSocketContext';
import { TMom } from 'src/types/mom';

import style from './style.module.scss';

interface MomListProps {
  moms: TMom[];
}

function MomList({ moms }: MomListProps) {
  const { momSocket: socket } = useSocketContext();

  const [momList, setMomList] = useState<TMom[]>(moms);

  const onCreateMom = () => {
    socket.emit('create-mom');
  };

  useEffect(() => {
    socket.on('created-mom', (mom) => setMomList((prev) => [...prev, mom]));
    // TODO: socket.on('selected-mom', () => {});

    return () => {
      socket.off('created-mom');
    };
  }, []);

  return (
    <div className={style['mom-list-container']}>
      <h2>회의록</h2>
      <ul className={style['mom-list']}>
        {momList.map((item) => (
          <li
            key={item._id}
            onClick={() => socket.emit('select-mom', item._id)}
          >
            {item._id}
          </li>
        ))}
      </ul>
      <button onClick={onCreateMom}>+ 회의록 추가</button>
    </div>
  );
}

export default MomList;
