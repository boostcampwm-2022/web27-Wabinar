import { BlockType } from '@wabinar/api-types/block';

import style from './style.module.scss';
interface BlockItemProps {
  id: number;
  name: string;
  desc: string;
  thumbnail: string;
  onSelect: (arg: BlockType) => void;
}

function BlockItem({ id, name, desc, thumbnail, onSelect }: BlockItemProps) {
  return (
    <li className={style['block-item']} onClick={() => onSelect(id)}>
      <img src={thumbnail} alt={name + '블록'} />

      <div className={style.text}>
        <div className={style.name}>{name}</div>
        <span className={style.desc}>{desc}</span>
      </div>
    </li>
  );
}

export default BlockItem;
