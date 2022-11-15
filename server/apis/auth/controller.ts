import express, { Request, Response, NextFunction } from "express";
import * as authService from "./service";

const router = express.Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;

      const { loginToken, refreshToken } = await authService.login(code);

      const cookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
        signed: true,
      };
      res.cookie("accessToken", loginToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/logout", (req: Request, res: Response) => {
  authService.logout(req.signedCookies.accessToken);

  res.clearCookie("accessToken");
  res.status(200).send();
});

export default router;
