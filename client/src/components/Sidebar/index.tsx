import WorkspaceSetting from '../WorkspaceSetting';
import style from './style.module.scss';

function Sidebar() {
  return (
    <div className={style['sidebar__container']}>
      <div className={style['header']}>
        <h1>왭^^</h1>
        <WorkspaceSetting />
      </div>
      <div className={style['member-list']}>
        <div className={style['member-item']}>
          <img src="https://avatars.githubusercontent.com/u/65100540?s=60&v=4" />
          <p>백도훈</p>
        </div>
        <div className={style['member-item']}>
          <img src="https://avatars.githubusercontent.com/u/65100540?s=60&v=4" />
          <p>백도훈</p>
        </div>
      </div>
      <div className={style['mom-list']}>
        <h2>회의록</h2>
        <p>회의록 1</p>
        <p>회의록 2</p>
        <p>회의록 3</p>
        <p>+ 회의록 추가</p>
      </div>
      <button className={style['conf-button']}>회의시작</button>
    </div>
  );
}

export default Sidebar;
