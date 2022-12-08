import { RiFileAddLine } from '@react-icons/all-files/ri/RiFileAddLine';
import { MOM_EVENT } from '@wabinar/constants/socket-message';
import { memo, useEffect, useState } from 'react';
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
    socket.emit(MOM_EVENT.CREATE);
  };

  const onSelect = (targetId: string) => {
    socket.emit(MOM_EVENT.SELECT, targetId);
  };

  useEffect(() => {
    if (moms.length) {
      socket.emit(MOM_EVENT.SELECT, moms[0]._id);
    }

    setMomList(moms);

    socket.on(MOM_EVENT.CREATE, (mom) => setMomList((prev) => [...prev, mom]));

    socket.on(MOM_EVENT.SELECT, (mom) => {
      setSelectedMom(mom);
    });

    return () => {
      socket.off(MOM_EVENT.CREATE);
      socket.off(MOM_EVENT.SELECT);
    };
  }, [moms]);

  return (
    <div className={style['mom-list-container']}>
      <div className={style['mom-list-header']}>
        <h2>회의록</h2>
        <RiFileAddLine
          size={20}
          className={
            momList.length
              ? style['mom-add-icon']
              : style['mom-add-icon__highlighted']
          }
          onClick={onCreateMom}
        />
      </div>
      <ul className={style['mom-list']}>
        {momList.map(({ _id: id, title }) => (
          <li key={id} onClick={() => onSelect(id)} role="button">
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(MomList);
