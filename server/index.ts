import authRouter from '@apis/auth/controller';
import userRouter from '@apis/user/controller';
import workspaceRouter from '@apis/workspace/controller';
import env from '@config';
import cors from '@middlewares/cors';
import errorHandler from '@middlewares/error-handler';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';
import momSocketServer from 'socket/mom';
import signalingSocketServer from './socket/signaling';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET_KEY));
app.use(cors());

app.get('/', (req: Request, res: Response) => res.send('Express'));
app.use('/auth', authRouter);
app.use('/workspace', workspaceRouter);
app.use('/user', userRouter);

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server({
  cors: {
    origin: env.CLIENT_PATH,
  },
});

momSocketServer(io);
signalingSocketServer(io);

io.attach(server);

server.listen(8080);
