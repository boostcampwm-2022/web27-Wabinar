import express, { Request, Response, NextFunction } from "express";
import asyncWrapper from "@utils/async-wrapper";
import jwtAuthenticator from "@middlewares/jwt-authenticator";
import * as workspaceService from "./service";
import { OK } from "@constants/http-status";

const router = express.Router();

router.post(
  "/",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const workspace = await workspaceService.create(name);

    res.status(OK).send({ ...workspace });
  })
);

router.post(
  "/join",
  jwtAuthenticator,
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    const joinResult = await workspaceService.join(req.user.id, code);

    res.status(OK).send(joinResult);
  })
);

export default router;
