const { login } = require('./service');
const { getAccessToken, getGithubUser } = require('./service.github');
const userModel = require('@apis/user/model');
const jwt = require('@utils/jwt');

jest.mock('./service.github', () => {
  return {
    getAccessToken: jest.fn(),
    getGithubUser: jest.fn(),
  };
});

jest.mock('@apis/user/model', () => {
  return {
    exists: jest.fn(),
    create: jest.fn().mockImplementation(() => undefined),
  };
});

jest.mock('@utils/jwt', () => {
  return {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };
});

describe('login', () => {
  const successfulTokenResponse = {
    access_token: '',
    token_type: '',
  };
  const successfulUserResponse = {
    id: '',
    login: '',
    avatar_url: '',
  };

  const ACCESS_TOKEN = 'ACCESS_TOKEN';
  const REFRESH_TOKEN = 'REFRESH_TOKEN';

  jwt.generateAccessToken.mockReturnValue(ACCESS_TOKEN);
  jwt.generateRefreshToken.mockReturnValue(REFRESH_TOKEN);

  it('유효한 코드를 받으면 토큰이 성공적으로 생성된다.', async () => {
    getAccessToken.mockResolvedValueOnce(successfulTokenResponse);
    getGithubUser.mockResolvedValueOnce(successfulUserResponse);
    userModel.exists.mockReturnValue(false);

    const { loginToken, refreshToken } = await login('');

    expect(loginToken).toBe(ACCESS_TOKEN);
    expect(refreshToken).toBe(REFRESH_TOKEN);
  });

  it('엑세스 토큰 획득 실패 시 에러를 던진다.', async () => {
    getAccessToken.mockRejectedValueOnce(new Error('fail'));

    expect(() => login()).rejects.toThrow('fail');
  });

  it('유저 정보 획득 실패 시 에러를 던진다.', async () => {
    getAccessToken.mockResolvedValueOnce(successfulTokenResponse);
    getGithubUser.mockRejectedValueOnce(new Error('fail'));

    expect(() => login()).rejects.toThrow('fail');
  });
});

export {};
