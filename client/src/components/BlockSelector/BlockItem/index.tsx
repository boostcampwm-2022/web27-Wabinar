import style from './style.module.scss';

interface BlockItemProps {
  name: string;
  desc: string;
  thumbnail: string;
}

function BlockItem({ name, desc, thumbnail }: BlockItemProps) {
  return (
    <li className={style['block-item']}>
      <img src={thumbnail} alt={name + '블록'} />

      <div className={style.text}>
        <div className={style.name}>{name}</div>
        <span className={style.desc}>{desc}</span>
      </div>
    </li>
  );
}

export default BlockItem;
