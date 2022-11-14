import jwt from "jsonwebtoken";
import env from "@config";

interface JwtPayload {
  id: number;
  name: string;
  avatarUrl: string;
}

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 1000,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;
};
