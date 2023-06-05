import { RiFileAddLine } from '@react-icons/all-files/ri/RiFileAddLine';
import * as MomMessage from '@wabinar/api-types/mom';
import { MOM_EVENT } from '@wabinar/constants/socket-message';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ee from 'src/components/Mom/EventEmitter';
import useSelectedMomContext from 'src/hooks/context/useSelectedMomContext';
import useSocketContext from 'src/hooks/context/useSocketContext';
import { TMom } from 'src/types/mom';

import style from './style.module.scss';

interface MomListProps {
  moms: TMom[];
}

function MomList({ moms }: MomListProps) {
  const { selectedMom, setSelectedMom } = useSelectedMomContext();

  const { momSocket: socket } = useSocketContext();
  const [momList, setMomList] = useState<TMom[]>(moms);

  const navigate = useNavigate();

  const onCreateMom = () => {
    socket.emit(MOM_EVENT.CREATE);
  };

  const onSelect = (id: string) => {
    const message: MomMessage.Select = { id };
    socket.emit(MOM_EVENT.SELECT, message);

    navigate(id);
    setSelectedMom(null);
  };

  useEffect(() => {
    setMomList(moms);
  }, [moms]);

  useEffect(() => {
    socket.on(MOM_EVENT.SELECT, ({ mom }: MomMessage.Selected) => {
      setSelectedMom(mom);
    });

    socket.on(MOM_EVENT.CREATE, ({ mom }: MomMessage.Created) =>
      setMomList((prev) => [...prev, mom]),
    );

    return () => {
      socket.off(MOM_EVENT.SELECT);
      socket.off(MOM_EVENT.CREATE);
    };
  }, [socket]);

  useEffect(() => {
    ee.on(MOM_EVENT.UPDATE_TITLE, (title) => {
      if (!selectedMom) return;

      const updatedMomList = momList.map((mom) => {
        if (mom._id === selectedMom._id) {
          return { ...mom, title };
        }
        return mom;
      });

      setMomList(updatedMomList);
    });

    return () => {
      ee.off(MOM_EVENT.UPDATE_TITLE);
    };
  }, [selectedMom]);

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
          <li
            key={id}
            className={
              selectedMom?._id === id ? style['mom-list-item__selected'] : ''
            }
            onClick={() => onSelect(id)}
            role="button"
          >
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MomList;
