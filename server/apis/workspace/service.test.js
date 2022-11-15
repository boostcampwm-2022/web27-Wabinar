jest.mock('./model', () => {
  return {
    repository: {},
    create: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };
});
const workspaceModel = require('./model');

jest.mock('@apis/user/model', () => {
  return {
    updateOne: jest.fn(),
  };
});
const userModel = require('@apis/user/model');

const VALID_CODE = 'wab-0000-0000-0000';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => VALID_CODE),
  };
});

const workspaceService = require('./service');

describe('create', () => {
  it('워크스페이스 이름이 주어진 경우 생성에 성공한다.', async () => {
    const WORKSPACE_NAME = 'Wab';

    workspaceModel.create.mockResolvedValueOnce({
      name: WORKSPACE_NAME,
      code: VALID_CODE,
    });

    expect(workspaceService.create(WORKSPACE_NAME)).resolves.toEqual({
      name: WORKSPACE_NAME,
      code: VALID_CODE,
    });
  });

  it('워크스페이스 이름이 없는 경우 생성에 실패한다.', async () => {
    expect(() => workspaceService.create()).rejects.toThrow(
      '워크스페이스 이름을 입력하세요 ^^',
    );
  });
});

describe('join', () => {
  const USER_ID = 1;

  it('유효한 참여코드가 주어진 경우 성공한다.', async () => {
    const WORKSPACE_ID = 1;
    const WORKSPACE_NAME = 'Wab';

    workspaceModel.findOne.mockResolvedValueOnce({
      id: WORKSPACE_ID,
      name: WORKSPACE_NAME,
      code: VALID_CODE,
      users: [],
      moms: [],
    });

    expect(workspaceService.join(USER_ID, VALID_CODE)).resolves.toEqual({
      id: WORKSPACE_ID,
      name: WORKSPACE_NAME,
      code: VALID_CODE,
    });
  });

  it('참여코드가 없는 경우 실패한다.', async () => {
    expect(() => workspaceService.join(USER_ID)).rejects.toThrow(
      '참여코드를 입력하세요 ^^',
    );
  });

  it('참여코드가 유효하지 않은 경우 실패한다.', async () => {
    workspaceModel.findOne.mockResolvedValueOnce(null);

    expect(() =>
      workspaceService.join(USER_ID, 'invalid-code'),
    ).rejects.toThrow('잘못된 참여코드에요 ^^');
  });

  it('db 업데이트 중 에러가 발생하면 실패한다.', async () => {
    workspaceModel.updateOne.mockRejectedValueOnce(
      new Error('Some error in database operation'),
    );

    expect(() => workspaceService.join(USER_ID, VALID_CODE)).rejects.toThrow();
  });
});
