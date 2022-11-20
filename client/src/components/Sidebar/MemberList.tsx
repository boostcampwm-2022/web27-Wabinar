import style from './style.module.scss';

function MemberList() {
  const members = [
    {
      id: 1,
      name: '백도훈',
      avatarUrl: 'https://avatars.githubusercontent.com/u/65100540?s=60&v=4',
    },
    {
      id: 2,
      name: '백도훈',
      avatarUrl: 'https://avatars.githubusercontent.com/u/65100540?s=60&v=4',
    },
  ];

  return (
    <div className={style['member-list']}>
      {members.map((item) => (
        <div key={item.id} className={style['member-item']}>
          <img src={item.avatarUrl} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
