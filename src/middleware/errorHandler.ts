import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.error(err.stack);
  } else {
    console.error(err);
  }

  res.status(500).json({ message: 'Internal Server Error.' });
};

export default errorHandler;
