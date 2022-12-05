import GuideIcon from 'src/components/common/GuideIcon';
import SleepingWabIcon from 'src/components/common/Icon/Wab/SleepingWabIcon';

import style from './style.module.scss';

function DefaultWorkspace() {
  return (
    <div className={style.container}>
      <SleepingWabIcon />
      <h1 className={style.message}>현재 가입하신 워크스페이스가 없어요.</h1>
      <GuideIcon>
        <p>왼쪽 + 버튼을 눌러 워크스페이스를 만들거나 참여해봐요!</p>
      </GuideIcon>
    </div>
  );
}

export default DefaultWorkspace;
