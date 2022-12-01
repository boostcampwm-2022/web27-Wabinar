import { Request, Response, NextFunction } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const message = err.message || 'Internal Server Error';
  const status = err.status || 500;

  res.status(status).send(message);
};
