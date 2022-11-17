export const MENU = {
  CREATE: 1,
  JOIN: 2,
  CREATE_SUCCESS: 3,
};
Object.freeze(MENU);

export const MENUS = [
  { id: 1, option: '생성하기' },
  { id: 2, option: '참여하기' },
];
Object.freeze(MENUS);

export const MODAL_MENUS = [
  {
    /* unused */
    title: '',
    texts: [],
    btnText: '',
  },
  {
    title: '워크스페이스 생성',
    texts: ['워크스페이스 이름을 입력해주세요.'],
    btnText: '생성하기',
  },
  {
    title: '워크스페이스 참여',
    texts: ['워크스페이스 코드를 입력해주세요.'],
    btnText: '참여하기',
  },
  {
    title: '워크스페이스 생성 완료',
    texts: [
      '워크스페이스가 생성되었습니다.',
      ' 멤버들에게 참여 코드를 공유해보세요.',
    ],
    btnText: '확인',
  },
];
Object.freeze(MODAL_MENUS);
