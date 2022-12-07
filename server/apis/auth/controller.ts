import { CREATED, OK } from '@constants/http-status';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import { PostLoginParams } from '@wabinar/api-types/auth';
import asyncWrapper from '@utils/async-wrapper';
import express, { Request, Response } from 'express';
import * as userService from '../user/service';
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
  asyncWrapper(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(OK).send({ user: req.user });
      return;
    }

    // req.user가 존재하면 workspaceList를 같이 받아옴
    const { id: userId, name, avatarUrl } = req.user;

    const workspaces = await userService.getWorkspaces(userId);

    const user = { id: userId, name, avatarUrl };

    res.status(OK).send({ user, workspaces });
  }),
);

// authorized된 유저가 아닐 경우(위에서 !req.user조건으로 return 됨)
// OAuth 페이지에서 workspace로 이동(navigate)하게 되므로
// 로그인 하여 받아온 유저 정보로 workspace list 정보도 함께 받아온다.
router.post(
  '/login',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<PostLoginParams>, res: Response) => {
    const { code } = req.body;

    const { user, loginToken, refreshToken } = await authService.login(code);

    const workspaces = await userService.getWorkspaces(Number(user.id));

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      signed: true,
    };
    res.cookie('accessToken', loginToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    console.log(loginToken);
    console.log(refreshToken);

    res.status(CREATED).send({ user, workspaces });
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
