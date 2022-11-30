import { WorkspaceInfo } from 'src/types/workspace';

import ConfButton from './ConfButton';
import MemberList from './MemberList';
import MomList from './MomList';
import SettingIcon from './SettingIcon';
import style from './style.module.scss';

interface SidebarProps {
  workspace: WorkspaceInfo;
}

function Sidebar({ workspace }: SidebarProps) {
  return (
    <div className={style['sidebar-container']}>
      <div className={style['header']}>
        <h1>{workspace.name}</h1>
        <SettingIcon />
      </div>
      <MemberList members={workspace.members} />
      <MomList moms={workspace.moms} />
      <ConfButton />
    </div>
  );
}

export default Sidebar;
