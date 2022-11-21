import ConfButton from './ConfButton';
import MemberList from './MemberList';
import MomList from './MomList';
import SettingIcon from './SettingIcon';
import style from './style.module.scss';

function Sidebar() {
  return (
    <div className={style['sidebar__container']}>
      <div className={style['header']}>
        <h1>왭^^</h1>
        <SettingIcon />
      </div>
      <MemberList />
      <MomList />
      <ConfButton />
    </div>
  );
}

export default Sidebar;
