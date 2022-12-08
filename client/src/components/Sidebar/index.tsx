import useSelectedMom from 'src/hooks/useSelectedMom';
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
  const { setSelectedMom } = useSelectedMom();

  return (
    <div className={style['sidebar-container']}>
      <Header name={workspace.name} />
      <MemberList members={workspace.members} />
      <MomList moms={workspace.moms} setSelectedMom={setSelectedMom} />
      <MeetingButton />
    </div>
  );
}

export default Sidebar;
