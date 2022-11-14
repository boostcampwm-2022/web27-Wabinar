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

export default router;
