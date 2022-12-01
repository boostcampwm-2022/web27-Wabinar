import { useEffect, useState } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
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
    socket.emit(SOCKET_MESSAGE.MOM.CREATE);
  };

  const onSelect = (targetId: string) => {
    if (selectedMom && selectedMom._id === targetId) return;
    socket.emit(SOCKET_MESSAGE.MOM.SELECT, targetId);
  };

  useEffect(() => {
    setMomList(moms);

    socket.on(SOCKET_MESSAGE.MOM.CREATE, (mom) =>
      setMomList((prev) => [...prev, mom]),
    );

    socket.on(SOCKET_MESSAGE.MOM.SELECT, (mom) => {
      setSelectedMom(mom);
    });

    return () => {
      socket.off(SOCKET_MESSAGE.MOM.CREATE);
      socket.off(SOCKET_MESSAGE.MOM.SELECT);
    };
  }, [moms]);

  return (
    <div className={style['mom-list-container']}>
      <h2>회의록</h2>
      <ul className={style['mom-list']}>
        {momList.map(({ _id: id }) => (
          <li key={id} onClick={() => onSelect(id)}>
            {id}
          </li>
        ))}
      </ul>
      <button onClick={onCreateMom}>+ 회의록 추가</button>
    </div>
  );
}

export default MomList;
