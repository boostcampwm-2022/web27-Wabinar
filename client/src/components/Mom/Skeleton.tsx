import style from './style.module.scss';

function MomSkeleton() {
  return (
    <div className={style['mom-container']}>
      <div className={style['mom']}>
        <div className={style['mom-header']}></div>
        <div className={style['mom-body']}></div>
      </div>
    </div>
  );
}

export default MomSkeleton;
