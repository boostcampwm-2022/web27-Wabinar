import style from './style.module.scss';

interface BlockItemProps {
  id: number;
  name: string;
  desc: string;
  thumbnail: string;
}

function BlockItem({ id, name, desc, thumbnail }: BlockItemProps) {
  return (
    <li key={id} className={style['block-item']}>
      <img src={thumbnail} alt={name + '블록'} />

      <div className={style.text}>
        <div className={style.name}>{name}</div>
        <span className={style.desc}>{desc}</span>
      </div>
    </li>
  );
}

export default BlockItem;
