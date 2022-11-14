import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@utils/jwt";

const jwtAuthenticator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.signedCookies;

    req.user = verifyToken(accessToken);

    return next();
  } catch (err) {
    return next(); // without verification
  }
};

export default jwtAuthenticator;
