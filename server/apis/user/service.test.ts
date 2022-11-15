const { getWorkspaces } = require('./service');
const userModel = require('@apis/user/model');
const workspaceModel = require('@apis/workspace/model');
const { default: AuthorizationError } = require('@errors/authorization-error');

jest.mock('@apis/user/model', () => {
  return { findOne: jest.fn() };
});

jest.mock('@apis/workspace/model', () => {
  return { find: jest.fn() };
});

describe('getWorkspaces', () => {
  const successfulUser = '';
  const successfulWorkspaces: Object[] = [];

  it('정상적인 유저 아이디를 받아서 성공적으로 워크스페이스를 가져온다.', async () => {
    userModel.findOne.mockResolvedValueOnce(successfulUser);
    workspaceModel.find.mockResolvedValueOnce(successfulWorkspaces);

    const workspaces = await getWorkspaces('id', 'id');

    expect(workspaces).toEqual(successfulWorkspaces);
  });

  it('비정상적인 유저 아이디를 받으면 에러를 던진다.', async () => {
    const user1 = 1;
    const user2 = 2;

    expect(() => getWorkspaces(user1, user2)).rejects.toThrow(
      AuthorizationError,
    );
  });
});

export {};
