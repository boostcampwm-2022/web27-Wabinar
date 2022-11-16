import express, { Request, Response } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import * as authService from './service';
import { OK, CREATED } from '@constants/http-status';
import { PostLoginParams } from '@params/auth';

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
  asyncWrapper(async (req: Request, res: Response) => {
    res.status(OK).send(req.user);
  }),
);

router.post(
  '/login',
  asyncWrapper(async (req: Request<PostLoginParams>, res: Response) => {
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

    res.status(CREATED).send(user);
  }),
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
