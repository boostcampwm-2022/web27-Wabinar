import { WorkspaceInfo } from 'src/types/workspace';

import ConfButton from './ConfButton';
import Header from './Header';
import MemberList from './MemberList';
import MomList from './MomList';
import style from './style.module.scss';

interface SidebarProps {
  workspace: WorkspaceInfo;
}

function Sidebar({ workspace }: SidebarProps) {
  return (
    <div className={style['sidebar-container']}>
      <Header name={workspace.name} />
      <MemberList members={workspace.members} />
      <MomList moms={workspace.moms} />
      <ConfButton />
    </div>
  );
}

export default Sidebar;
