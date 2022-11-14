import express, { Request, Response } from "express";
import authRouter from "@apis/auth/controller";

const app = express();

app.get("/", (req: Request, res: Response) => res.send("Express"));
app.use("/auth", authRouter);

app.listen(8080);
