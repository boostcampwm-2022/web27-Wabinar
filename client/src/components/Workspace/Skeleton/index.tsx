import style from './style.module.scss';

function SideBarSkeleton() {
  return (
    <div className={style['side-bar-sk']}>
      <div className={style['name']}></div>
      <div className={style['members']}></div>
      <div className={style['moms']}></div>
    </div>
  );
}

function MomSkeleton() {
  return (
    <div className={style['mom-sk']}>
      <div className={style['head']}>
        <div className={style['title']}></div>
        <div className={style['date']}></div>
      </div>
      <div className={style['mom']}></div>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className={style['workspace-sk']}>
      <SideBarSkeleton />
      <MomSkeleton />
    </div>
  );
}

export default WorkspaceSkeleton;
