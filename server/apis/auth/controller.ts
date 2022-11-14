import express, { Request, Response, NextFunction } from "express";
import asyncWrapper from "@utils/async-wrapper";
import * as authService from "./service";

const router = express.Router();

router.post(
  "/login",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    const loginToken = await authService.login(code);

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      signed: true,
    };
    res.cookie("accessToken", loginToken, cookieOptions);

    res.status(200).send();
  })
);

router.delete(
  "/logout",
  asyncWrapper(async (req: Request, res: Response) => {
    await authService.logout(req.signedCookies.accessToken);

    res.clearCookie("accessToken");
    res.status(200).send();
  })
);

export default router;
