import jwtAuthenticator from '@middlewares/jwt-authenticator';
import { GetWorkspaceParams } from '@wabinar/api-types//user';
import asyncWrapper from '@utils/async-wrapper';
import express, { Request, Response } from 'express';
import * as userService from './service';

const router = express.Router();

router.get(
  '/:id/workspace',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<GetWorkspaceParams>, res: Response) => {
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
