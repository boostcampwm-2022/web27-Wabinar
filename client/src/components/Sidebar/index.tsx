import { useRecoilValue } from 'recoil';
import { workspaceState } from 'src/store/atom/workspace';

import Header from './Header';
import MeetingButton from './MeetingButton';
import MemberList from './MemberList';
import MomList from './MomList';
import style from './style.module.scss';

function Sidebar() {
  const workspace = useRecoilValue(workspaceState);

  if (!workspace) {
    return <div className={style['sidebar-container']}></div>;
  }

  const { name, members, moms } = workspace;

  return (
    <div className={style['sidebar-container']}>
      <Header name={name} />
      <div className={style['sidebar-container__scrollable']}>
        <MemberList members={members} />
        <MomList moms={moms} />
      </div>
      <MeetingButton />
    </div>
  );
}

export default Sidebar;
