import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRouter from "@apis/auth/controller";

const app = express();
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => res.send("Express"));
app.use("/auth", authRouter);

app.listen(8080);
