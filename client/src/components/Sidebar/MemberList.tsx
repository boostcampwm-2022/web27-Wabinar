import { memo } from 'react';
import { User } from 'src/types/user';

import style from './style.module.scss';

interface MemberListProps {
  members: User[];
}

function MemberList({ members }: MemberListProps) {
  return (
    <ul className={style['member-list']}>
      {members.map((item) => (
        <li key={item.id} className={style['member-item']}>
          <img src={item.avatarUrl} />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default memo(MemberList);
