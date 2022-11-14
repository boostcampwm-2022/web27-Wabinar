import jwt from "jsonwebtoken";
import env from "@config";

interface JwtPayload {
  id: number;
  name: string;
  avatarUrl: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET_KEY);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET_KEY);
};
