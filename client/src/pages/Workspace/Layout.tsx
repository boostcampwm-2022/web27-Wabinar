import WorkspaceList from 'components/WorkspaceList';
import { Outlet } from 'react-router-dom';

import style from './style.module.scss';

function Layout() {
  return (
    <div className={style.container}>
      <WorkspaceList />
      <Outlet />
    </div>
  );
}

export default Layout;
