import { CREATED, OK } from '@constants/http-status';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import { LoginResBody, PostLoginBody } from '@wabinar/api-types/auth';
import asyncWrapper from '@utils/async-wrapper';
import express, { Request, Response } from 'express';
import * as authService from './service';

interface CookieOptions {
  httpOnly: boolean;
  sameSite: boolean | 'lax' | 'strict' | 'none';
  maxAge: number;
  signed: boolean;
}

const router = express.Router();

router.get(
  '/',
  jwtAuthenticator,
  asyncWrapper(async (req: Request, res: Response<LoginResBody>) => {
    if (!req.user) {
      res.status(OK).send({ user: req.user });
      return;
    }

    const { id: userId, name, avatarUrl } = req.user;

    const user = { id: userId, name, avatarUrl };

    res.status(OK).send({ user });
  }),
);

router.post(
  '/login',
  jwtAuthenticator,
  asyncWrapper(
    async (
      req: Request<{}, {}, PostLoginBody>,
      res: Response<LoginResBody>,
    ) => {
      const { code } = req.body;

      const { user, loginToken, refreshToken } = await authService.login(code);

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
        signed: true,
      };
      res.cookie('accessToken', loginToken, cookieOptions);
      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.status(CREATED).send({ user });
    },
  ),
);

router.delete(
  '/logout',
  asyncWrapper(async (req: Request, res: Response) => {
    await authService.logout(req.signedCookies.accessToken);

    res.clearCookie('accessToken');
    res.status(OK).send();
  }),
);

export default router;
