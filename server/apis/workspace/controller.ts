import express, { Request, Response, NextFunction } from "express";
import asyncWrapper from "@utils/async-wrapper";
import * as workspaceService from "./service";

const router = express.Router();

router.post(
  "/",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const workspace = workspaceService.create(name);

    res.status(200).send({ workspace });
  })
);

router.post(
  "/join",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    const joinResult = await workspaceService.join(1, code);

    res.status(200).send(joinResult);
  })
);

export default router;
