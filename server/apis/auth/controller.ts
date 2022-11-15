import express, { Request, Response, NextFunction } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import * as authService from './service';
import { OK, CREATED } from '@constants/http-status';

const router = express.Router();

router.post(
  '/login',
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    const { user, loginToken, refreshToken } = await authService.login(code);

    const cookieOptions = {
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
