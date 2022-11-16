import env from '@config';
import { Request, Response, NextFunction } from 'express';
import { OK } from '@constants/http-status';

export default () => (req: Request, res: Response, next: NextFunction) => {
  res.append('Access-Control-Allow-Origin', env.CLIENT_PATH);
  res.append('Access-Control-Allow-Credentials', 'true');
  res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.append('Access-Control-Allow-Headers', 'Content-Type, Origin, Cookies');

  if (req.method === 'OPTIONS') {
    res.status(OK).send();
    return;
  }

  next();
};
