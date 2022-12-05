import GuideMessage from 'src/components/common/GuideMessage';
import SleepingWabIcon from 'src/components/common/Icon/Wab/SleepingWabIcon';

import style from './style.module.scss';

function DefaultWorkspace() {
  return (
    <div className={style.container}>
      <SleepingWabIcon />
      <h1 className={style.message}>현재 가입하신 워크스페이스가 없어요.</h1>
      <GuideMessage>
        <p>왼쪽 + 버튼을 눌러</p>
        <p>워크스페이스를 만들거나 참여봐요!</p>
      </GuideMessage>
    </div>
  );
}

export default DefaultWorkspace;
