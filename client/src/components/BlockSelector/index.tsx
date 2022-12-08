import { BlockType } from '@wabinar/api-types/block';
import { BLOCKS_TYPE } from 'src/constants/block';

import BlockItem from './BlockItem';
import style from './style.module.scss';

interface BlockSelectorProps {
  onSelect: (arg: BlockType) => void;
}

function BlockSelector({ onSelect }: BlockSelectorProps) {
  return (
    <div className={style['block-selector']}>
      <div className={style['block-displayed']}>
        <strong>블록</strong>

        <ul className={style['block-list']}>
          {BLOCKS_TYPE.map(({ id, name, desc, thumbnail }) => (
            <BlockItem key={id} {...{ id, name, desc, thumbnail, onSelect }} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BlockSelector;
