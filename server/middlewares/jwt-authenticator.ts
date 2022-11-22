import { verifyToken } from '@utils/jwt';
import { NextFunction, Request, Response } from 'express';

/* "/auth" 에서 accessToken이 없을 경우 에러를 뱉어서 클라에 500에러가 가서 수정했어요 */
// accessToken이 없으면 /login으로 들어가야 하기 때문에 req.user가 없을 경우는 /auth 컨트롤러 내에서 판단할게요
const jwtAuthenticator = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.signedCookies;

  if (accessToken) {
    req.user = verifyToken(accessToken);
  }

  return next();
};

export default jwtAuthenticator;
