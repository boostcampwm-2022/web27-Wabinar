import { RiFileAddLine } from '@react-icons/all-files/ri/RiFileAddLine';
import * as MomMessage from '@wabinar/api-types/mom';
import { MOM_EVENT } from '@wabinar/constants/socket-message';
import { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSocketContext from 'src/hooks/context/useSocketContext';
import { TMom } from 'src/types/mom';

import ee from '../Mom/EventEmitter';
import style from './style.module.scss';

interface MomListProps {
  moms: TMom[];
  selectedMom: TMom | null;
  setSelectedMom: React.Dispatch<React.SetStateAction<TMom | null>>;
}

function MomList({ moms, selectedMom, setSelectedMom }: MomListProps) {
  const { momSocket: socket } = useSocketContext();
  const [momList, setMomList] = useState<TMom[]>(moms);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onCreateMom = () => {
    socket.emit(MOM_EVENT.CREATE);
  };

  const onSelect = (id: string) => {
    const message: MomMessage.Select = { id };
    socket.emit(MOM_EVENT.SELECT, message);
  };

  useEffect(() => {
    if (moms.length) {
      const momId =
        pathname.match(/\/workspace\/\d+\/(?<momId>.+)/)?.groups?.momId ??
        moms[0]._id;
      const message: MomMessage.Select = { id: momId };
      socket.emit(MOM_EVENT.SELECT, message);
    }

    setMomList(moms);

    ee.on(MOM_EVENT.REQUEST_LOADED, () => {
      ee.emit(MOM_EVENT.LOADED, moms ? moms.length : 0);
    });

    socket.on(MOM_EVENT.CREATE, ({ mom }: MomMessage.Created) =>
      setMomList((prev) => [...prev, mom]),
    );

    socket.on(MOM_EVENT.SELECT, ({ mom }: MomMessage.Selected) => {
      navigate(mom._id);
      setSelectedMom(mom);
    });

    return () => {
      socket.off(MOM_EVENT.CREATE);
      socket.off(MOM_EVENT.SELECT);
      ee.off(MOM_EVENT.REQUEST_LOADED);
    };
  }, [moms]);

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
  }, []);

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

const isMemoized = (prevProps: MomListProps, nextProps: MomListProps) => {
  return prevProps.moms === nextProps.moms;
};

export default memo(MomList, isMemoized);
