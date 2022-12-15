import style from './style.module.scss';

function SideBarSkeleton() {
  return (
    <div className={style['sidebar-container']}>
      <div className={style['header']}></div>
      <div className={style['member-list']}></div>
      <div className={style['mom-list-container']}></div>
    </div>
  );
}

export default SideBarSkeleton;
