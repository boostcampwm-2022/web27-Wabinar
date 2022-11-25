import axios from 'axios';
import env from '@config';
import AuthorizationError from '@errors/authorization-error';

const ACCESS_TOKEN_REQUEST_URL = 'https://github.com/login/oauth/access_token';
const USER_REQUEST_URL = 'https://api.github.com/user';

export const getAccessToken = async (code: string) => {
  const body = {
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code,
  };
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const accessTokenResponse = await fetch(ACCESS_TOKEN_REQUEST_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  }).then((res) => res.json());

  if (accessTokenResponse.error) {
    throw new Error('access token 생성 요청 실패');
  }

  return accessTokenResponse;
};

export const getGithubUser = async (accessToken: string, tokenType: string) => {
  const userResponse = await fetch(USER_REQUEST_URL, {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  }).then((res) => res.json());

  if (userResponse.error) {
    throw new AuthorizationError('OAuth 유저 정보 요청 실패');
  }

  return userResponse;
};
