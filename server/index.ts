import authRouter from '@apis/auth/controller';
import userRouter from '@apis/user/controller';
import workspaceRouter from '@apis/workspace/controller';
import momSocketServer from 'socket/mom';
import env from '@config';
import cors from '@middlewares/cors';
import errorHandler from '@middlewares/error-handler';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET_KEY));
app.use(cors());

app.get('/', (req: Request, res: Response) => res.send('Express'));
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server({
  cors: {
    origin: env.CLIENT_PATH,
  },
});

momSocketServer(io);

io.attach(server);

server.listen(8080);
