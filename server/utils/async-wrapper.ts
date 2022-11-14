import { NextFunction, Request, Response } from "express";

const asyncWrapper =
  (fn: Function) =>
  async (req: Request, res: Response | null, next: NextFunction | null) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      next(e);
    }
  };

export default asyncWrapper;
