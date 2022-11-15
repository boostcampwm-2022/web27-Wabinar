import express, { Request, Response, NextFunction } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import * as userService from './service';
import jwtAuthenticator from '@middlewares/jwt-authenticator';

const router = express.Router();

router.get(
  '/:id/workspace',
  jwtAuthenticator,
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user;
    const { id: targetUserId } = req.params;

    const workspaces = await userService.getWorksapces(targetUserId, userId);

    res.send({ workspaces });
  }),
);

export default router;
