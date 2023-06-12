import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getWorkspaceInfo } from 'src/apis/workspace';

import Header from './Header';
import MeetingButton from './MeetingButton';
import MemberList from './MemberList';
import MomList from './MomList';
import style from './style.module.scss';

function Sidebar() {
  const { id } = useParams();
  const { data: workspace } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => getWorkspaceInfo({ id }),
  });

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
