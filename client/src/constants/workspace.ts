export const MENU = {
  CREATE_ID: 1,
  JOIN_ID: 2,
  JOIN_SUCCESS_ID: 3,
};

export const MENUS = [
  { id: 1, text: '생성하기' },
  { id: 2, text: '참여하기' },
];

export const MODAL_MENUS = [
  {
    id: 1,
    props: {
      title: '워크스페이스 생성',
      texts: ['워크스페이스 이름을 입력해주세요.'],
      btnText: '생성하기',
    },
  },
  {
    id: 2,
    props: {
      title: '워크스페이스 참여',
      texts: ['워크스페이스 코드를 입력해주세요.'],
      btnText: '참여하기',
    },
  },
  {
    id: 3,
    props: {
      title: '워크스페이스 생성 완료',
      texts: [
        '워크스페이스가 생성되었습니다.',
        ' 멤버들에게 참여 코드를 공유해보세요.',
      ],
      btnText: '확인',
    },
  },
];
