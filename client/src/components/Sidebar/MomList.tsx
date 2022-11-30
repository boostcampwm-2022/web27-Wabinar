import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
import { TMom } from 'src/types/mom';

import style from './style.module.scss';

interface MomListProps {
  moms: TMom[];
}

function MomList({ moms }: MomListProps) {
  const { selectedMom, setSelectedMom } = useMom();
  const { momSocket: socket } = useSocketContext();
  const [momList, setMomList] = useState<TMom[]>(moms);

  const onCreateMom = () => {
    socket.emit('create-mom');
  };

  const onSelect = (targetId: string) => {
    if (selectedMom && selectedMom._id === targetId) return;
    socket.emit('select-mom', targetId);
  };

  useEffect(() => {
    // 첫번째 회의록을 디폴트로 설정
    if (moms.length) {
      socket.emit('select-mom', moms[0]._id);
    }

    setMomList(moms);

    socket.on('created-mom', (mom) => setMomList((prev) => [...prev, mom]));

    socket.on('selected-mom', (mom) => {
      setSelectedMom(mom);
    });

    return () => {
      socket.off('created-mom');
      socket.off('selected-mom');
    };
  }, [moms]);

  return (
    <div className={style['mom-list-container']}>
      <h2>회의록</h2>
      <ul className={style['mom-list']}>
        {momList.map(({ _id: id, name }) => (
          <li key={id} onClick={() => onSelect(id)}>
            {name}
          </li>
        ))}
      </ul>
      <button onClick={onCreateMom}>+ 회의록 추가</button>
    </div>
  );
}

export default MomList;
