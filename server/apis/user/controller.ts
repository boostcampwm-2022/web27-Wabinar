import express, { Request, Response } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import * as userService from './service';
import jwtAuthenticator from '@middlewares/jwt-authenticator';

const router = express.Router();

router.get(
  '/:id/workspace',
  jwtAuthenticator,
  asyncWrapper(async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id: targetUserId } = req.params;

    const workspaces = await userService.getWorkspaces(
      Number(targetUserId),
      userId,
    );

    res.send({ workspaces });
  }),
);

export default router;
