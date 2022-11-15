/**
 * success -> userId === targetUserId
 * fail -> userId !== targetUserId
 */

// userId 들을 넘기면 워크스페이스를 받는 것
// userId를 넘겼을 때 성공적으로 워크스페이스를 받는 경우
// 뭔가 userId가 이상해서 워크스페이스 못받는 경우
const { getWorkspaces } = require('./service');
const userModel = require('@apis/user/model');
const workspaceModel = require('@apis/workspace/model');
const { default: AuthorizationError } = require('@errors/authorization-error');
const { default: CustomError } = require('@errors/index');

jest.mock('@apis/user/model', () => {
  return { findOne: jest.fn() };
});

jest.mock('@apis/workspace/model', () => {
  return { find: jest.fn() };
});

describe('getWorkspaces()', () => {
  const successfulUser = '';
  const successfulWorkspaces: Object[] = [];

  it('정상적인 유저 아이디를 받아서 성공적으로 워크스페이스를 가져온다.', async () => {
    // arrange
    userModel.findOne.mockResolvedValueOnce(successfulUser);
    workspaceModel.find.mockResolvedValueOnce(successfulWorkspaces);

    // act
    const workspaces = await getWorkspaces('id', 'id');

    // assert
    expect(workspaces).toEqual(successfulWorkspaces);
  });

  it('비정상적인 유저 아이디를 받으면 에러를 던진다.', async () => {
    // arrange
    const user1 = 1;
    const user2 = 2;

    // act & assert
    expect(() => getWorkspaces(user1, user2)).rejects.toThrow(
      AuthorizationError,
    );
  });
});
