const workspaceModel = require('./model');
const workspaceService = require('./service');
const { default: InvalidJoinError } = require('@errors/invalid-join-error');
const {
  default: InvalidWorkspaceError,
} = require('@errors/invalid-workspace-error');

jest.mock('./model', () => {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };
});

jest.mock('@apis/user/model', () => {
  return {
    find: jest.fn(),
    updateOne: jest.fn(),
  };
});

jest.mock('@apis/mom/model', () => {
  return { find: jest.fn() };
});

const VALID_CODE = 'wab-0000-0000-0000';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => VALID_CODE),
  };
});

describe('create', () => {
  it('워크스페이스 이름이 주어진 경우 생성에 성공한다.', async () => {
    const WORKSPACE_ID = 1;
    const WORKSPACE_NAME = 'Wab';

    const workspace = {
      id: 2,
      name: 'asdf',
      code: VALID_CODE,
    };

    workspaceModel.create.mockResolvedValueOnce(workspace);

    expect(workspaceService.create(WORKSPACE_NAME)).resolves.toEqual(workspace);
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
      InvalidJoinError,
    );
  });

  it('참여코드가 유효하지 않은 경우 실패한다.', async () => {
    workspaceModel.findOne.mockResolvedValueOnce(null);

    expect(() =>
      workspaceService.join(USER_ID, 'invalid-code'),
    ).rejects.toThrow(InvalidJoinError);
  });

  it('db 업데이트 중 에러가 발생하면 실패한다.', async () => {
    workspaceModel.updateOne.mockRejectedValueOnce(
      new Error('Some error in database operation'),
    );

    expect(() => workspaceService.join(USER_ID, VALID_CODE)).rejects.toThrow();
  });
});

describe('info', () => {
  const WORKSPACE_ID = 1;
  const INVALID_WORKSPACE_ID = -1;

  it('워크스페이스 ID가 DB에 존재할 경우 조회에 성공한다.', async () => {
    const WORKSPACE_NAME = 'Wab';

    workspaceModel.findOne.mockResolvedValueOnce({
      id: WORKSPACE_ID,
      name: WORKSPACE_NAME,
      code: VALID_CODE,
      users: [],
      moms: [],
    });

    expect(workspaceService.info(WORKSPACE_ID)).resolves.toEqual({
      name: WORKSPACE_NAME,
      users: [],
      moms: [],
    });
  });

  it('워크스페이스 Id가 없는 경우 실패한다.', async () => {
    expect(() => workspaceService.info()).rejects.toThrow(
      InvalidWorkspaceError,
    );
  });

  it('워크스페이스 Id가 DB에 존재하지 않는 경우 실패한다.', async () => {
    workspaceModel.findOne.mockResolvedValueOnce(null);

    expect(() => workspaceService.info(INVALID_WORKSPACE_ID)).rejects.toThrow(
      InvalidWorkspaceError,
    );
  });

  it('워크스페이스 정보 획득 실패 시 에러를 던진다.', async () => {
    workspaceModel.findOne.mockRejectedValueOnce(
      new Error('Some error in database operation'),
    );

    expect(() => workspaceService.info(WORKSPACE_ID)).rejects.toThrow();
  });
});

export {};
