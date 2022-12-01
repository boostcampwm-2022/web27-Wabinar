import { useEffect, useState, memo  } from 'react';
import SOCKET_MESSAGE from 'src/constants/socket-message';
import useMom from 'src/hooks/useSelectedMom';
import useSocketContext from 'src/hooks/useSocketContext';
import { TMom } from 'src/types/mom';

import style from './style.module.scss';

interface MomListProps {
  moms: TMom[];
  setSelectedMom: React.Dispatch<React.SetStateAction<TMom | null>>;
}

function MomList({ moms, setSelectedMom }: MomListProps) {
  const { momSocket: socket } = useSocketContext();
  const [momList, setMomList] = useState<TMom[]>(moms);

  const onCreateMom = () => {
    socket.emit(SOCKET_MESSAGE.MOM.CREATE);
  };

  const onSelect = (targetId: string) => {
    socket.emit(SOCKET_MESSAGE.MOM.SELECT, targetId);
  };

  useEffect(() => {
    // 첫번째 회의록을 디폴트로 설정
    if (moms.length) {
      socket.emit('select-mom', moms[0]._id);
    }

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

export default memo(MomList);
