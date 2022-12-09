import { RiFileAddLine } from '@react-icons/all-files/ri/RiFileAddLine';
import GuideIcon from 'src/components/common/GuideIcon';
import AmazedWabIcon from 'src/components/common/Icon/Wab/AmazedWabIcon';

import style from './style.module.scss';

function DefaultMom() {
  return (
    <div className={style['default-container']}>
      <AmazedWabIcon />
      <h1 className={style.message}>회의록이 텅텅 비었어요.</h1>
      <GuideIcon>
        <p>
          사이드바에서{' '}
          <span className={style.highlight}>
            <RiFileAddLine size={20} />
          </span>{' '}
          버튼을 클릭해
          <br />
          회의록을 추가해 보세요!
        </p>
      </GuideIcon>
    </div>
  );
}

export default DefaultMom;
