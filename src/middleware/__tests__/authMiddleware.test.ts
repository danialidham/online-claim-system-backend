import { Request, Response, NextFunction } from 'express';
import authMiddleware from '../authMiddleware';
import { verifyToken } from '../../utils/jwt';
import User from '../../models/User';

jest.mock('../../utils/jwt');
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header is present', async () => {
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized. No token provided.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    req.headers = {
      authorization: 'Bearer invalid-token',
    };
    (verifyToken as jest.Mock).mockReturnValue(null);

    await authMiddleware(req as Request, res as Response, next);

    expect(verifyToken).toHaveBeenCalledWith('invalid-token');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized. Invalid token.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not found', async () => {
    req.headers = {
      authorization: 'Bearer valid-token',
    };
    (verifyToken as jest.Mock).mockReturnValue({
      id: 1,
      email: 'john@example.com',
    });
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await authMiddleware(req as Request, res as Response, next);

    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: 1, email: 'john@example.com' },
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized. User not found.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should attach user to request and call next if token is valid and user exists', async () => {
    req.headers = {
      authorization: 'Bearer valid-token',
    };
    const mockUser = { id: 1, email: 'john@example.com' };
    (verifyToken as jest.Mock).mockReturnValue({
      id: 1,
      email: 'john@example.com',
    });
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await authMiddleware(req as Request, res as Response, next);

    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: 1, email: 'john@example.com' },
    });
    expect(req.user).toEqual({ id: 1, email: 'john@example.com' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
