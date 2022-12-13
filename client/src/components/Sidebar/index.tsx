import useSelectedMomContext from 'src/hooks/context/useSelectedMomContext';
import { WorkspaceInfo } from 'src/types/workspace';

import Header from './Header';
import MeetingButton from './MeetingButton';
import MemberList from './MemberList';
import MomList from './MomList';
import style from './style.module.scss';

interface SidebarProps {
  workspace: WorkspaceInfo;
}

function Sidebar({ workspace }: SidebarProps) {
  const { setSelectedMom } = useSelectedMomContext();

  return (
    <div className={style['sidebar-container']}>
      <Header name={workspace.name} />
      <div className={style['sidebar-container__scrollable']}>
        <MemberList members={workspace.members} />
        <MomList moms={workspace.moms} setSelectedMom={setSelectedMom} />
      </div>
      <MeetingButton />
    </div>
  );
}

export default Sidebar;
