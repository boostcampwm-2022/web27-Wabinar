import axios from "axios";
import env from "@config";
import userModel from "@apis/user/model";
import * as jwt from "@utils/jwt";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

const ACCESS_TOKEN_REQUEST_URL = "https://github.com/login/oauth/access_token";
const USER_REQUEST_URL = "https://api.github.com/user";

const getAccessToken = async (code: string) => {
  const { data: accessTokenResponse } = await axios.post(
    ACCESS_TOKEN_REQUEST_URL,
    {
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (accessTokenResponse.error) {
    throw new Error("access token 생성 요청 실패");
  }

  return accessTokenResponse;
};

const getGithubUser = async (accessToken: string, tokenType: string) => {
  const { data: user } = await axios.get(USER_REQUEST_URL, {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });

  if (user.error) {
    throw new Error("OAuth 유저 정보 요청 실패");
  }

  return user;
};

export const login = async (code: string) => {
  const { access_token: accessToken, token_type: tokenType }: TokenResponse =
    await getAccessToken(code);

  const {
    id,
    login: name,
    avatar_url: avatarUrl,
  } = await getGithubUser(accessToken, tokenType);

  const payload = { id, name, avatarUrl };

  const loginToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);

  const isSignedUp = userModel.exists({ id });

  if (!isSignedUp) {
    userModel.create({
      id,
      name,
      avatarUrl,
      refreshToken,
    });
  } else {
    userModel.updateOne({ id }, { refreshToken });
  }

  return loginToken;
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
