import userModel from '@apis/user/model';
import * as jwt from '@utils/jwt';
import { getAccessToken, getGithubUser } from './service.github';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const login = async (code: string) => {
  const { access_token: accessToken, token_type: tokenType }: TokenResponse =
    await getAccessToken(code);

  const {
    id,
    login: name,
    avatar_url: avatarUrl,
  } = await getGithubUser(accessToken, tokenType);

  const isSignedUp = userModel.exists({ id });

  if (!isSignedUp) {
    await userModel.create({
      id,
      name,
      avatarUrl,
    });
  }

  const payload = { id, name, avatarUrl };

  const loginToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);

  return { loginToken, refreshToken };
};

export const logout = async (accessToken: string) => {
  try {
    const { id } = jwt.verifyToken(accessToken);

    userModel.updateOne({ id }, { refreshToken: null });
    return;
  } catch (err) {
    /* 
      https://github.com/auth0/node-jsonwebtoken

      err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }

      throw err;
    */
  }
};
