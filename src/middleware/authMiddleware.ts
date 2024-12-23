import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as { id: number; email: string };

    const user = await User.findOne({
      where: { id: decoded.id, email: decoded.email },
    });
    if (!user) {
      res.status(401).json({ message: 'Unauthorized. User not found.' });
      return;
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};

export default authMiddleware;
