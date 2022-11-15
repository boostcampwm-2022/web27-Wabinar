import express, { Request, Response } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import * as workspaceService from './service';
import { OK } from '@constants/http-status';

const router = express.Router();

router.post(
  '/',
  asyncWrapper(async (req: Request, res: Response) => {
    const { name } = req.body;

    const workspace = await workspaceService.create(name);

    res.status(OK).send({ ...workspace });
  }),
);

router.post(
  '/join',
  jwtAuthenticator,
  asyncWrapper(async (req: Request, res: Response) => {
    const { code } = req.body;

    const joinedWorkspace = await workspaceService.join(req.user.id, code);

    res.status(OK).send(joinedWorkspace);
  }),
);

export default router;
