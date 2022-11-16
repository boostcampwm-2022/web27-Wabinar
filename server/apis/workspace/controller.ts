import express, { Request, Response } from 'express';
import asyncWrapper from '@utils/async-wrapper';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import * as workspaceService from './service';
import { CREATED } from '@constants/http-status';
import { PostParams, PostJoinParams, GetInfoParams } from '@params/workspace';

const router = express.Router();

/* POST: 워크스페이스 생성 */
router.post(
  '/',
  asyncWrapper(async (req: Request<PostParams>, res: Response) => {
    const { name } = req.body;

    const workspace = await workspaceService.create(name);

    res.status(CREATED).send(workspace);
  }),
);

/* POST: 워크스페이스 참여 */
router.post(
  '/join',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<PostJoinParams>, res: Response) => {
    const { code } = req.body;

    const joinedWorkspace = await workspaceService.join(req.user.id, code);

    res.status(CREATED).send(joinedWorkspace);
  }),
);

/* GET: 특정 워크스페이스의 멤버, 회의록 목록 */
router.get(
  '/:id',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<GetInfoParams>, res: Response) => {
    const { id: workspaceId } = req.params;

    const workspaceInfo = await workspaceService.info(Number(workspaceId));

    res.send(workspaceInfo);
  }),
);

export default router;
