import { BLOCKS_TYPE } from 'src/constants/block';

import BlockItem from './BlockItem';
import style from './style.module.scss';

function BlockSelector() {
  return (
    <div className={style['block-selector']}>
      <div className={style['block-is-view']}>
        <strong>블록</strong>

        <ul className={style['block-list']}>
          {BLOCKS_TYPE.map(({ id, name, desc, thumbnail }) => (
            <BlockItem key={id} {...{ id, name, desc, thumbnail }} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BlockSelector;
