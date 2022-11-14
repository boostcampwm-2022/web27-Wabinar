import express, { Request, Response, NextFunction } from "express";
import asyncWrapper from "@utils/async-wrapper";
import jwtAuthenticator from "@middlewares/jwt-authenticator";
import * as workspaceService from "./service";

const router = express.Router();

router.post(
  "/",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const workspace = await workspaceService.create(name);

    res.status(200).send({ ...workspace });
  })
);

router.post(
  "/join",
  jwtAuthenticator,
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    const joinResult = await workspaceService.join(req.user.id, code);

    res.status(200).send(joinResult);
  })
);

export default router;
