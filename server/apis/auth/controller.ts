import express, { Request, Response, NextFunction } from "express";
import * as authService from "./service";

const router = express.Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;

      const loginToken = await authService.login(code);

      const cookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      };
      res.cookie("accessToken", loginToken, cookieOptions);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
);

router.get("/logout", (req: Request, res: Response) => {
  authService.logout(req.cookies.accessToken);

  res.clearCookie("accessToken");
  res.status(200).send();
});

export default router;
