import express, { Request, Response } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import * as workspaceService from './service';
import { CREATED } from '@constants/http-status';
import { postParams, postJoinParams } from '@params/workspace';

const router = express.Router();

router.post(
  '/',
  asyncWrapper(async (req: Request<postParams>, res: Response) => {
    const { name } = req.body;

    const workspace = await workspaceService.create(name);

    res.status(CREATED).send({ ...workspace });
  }),
);

router.post(
  '/join',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<postJoinParams>, res: Response) => {
    const { code } = req.body;

    const joinedWorkspace = await workspaceService.join(req.user.id, code);

    res.status(CREATED).send(joinedWorkspace);
  }),
);

export default router;
