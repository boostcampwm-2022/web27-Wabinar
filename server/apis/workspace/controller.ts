import express, { Request, Response, NextFunction } from "express";
import * as workspaceService from "./service";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    const workspace = workspaceService.create(name);

    res.status(200).send({ workspace });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/join",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    const joinResult = await workspaceService.join(1, code);

    res.status(200).send(joinResult);
  }
);

export default router;
