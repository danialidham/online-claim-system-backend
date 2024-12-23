import { Request, Response, NextFunction } from 'express';
import { register, login, resetPassword } from '../authController';
import User from '../../models/User';
import PasswordReset from '../../models/PasswordReset';
import { generateToken } from '../../utils/jwt';
import { sendEmail } from '../../utils/email';

jest.mock('../../models/User');
jest.mock('../../models/PasswordReset');
jest.mock('../../utils/jwt');
jest.mock('../../utils/email');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
      };

      (User.create as jest.Mock).mockResolvedValue(mockUser);

      (generateToken as jest.Mock).mockReturnValue('fake-jwt-token');

      await register(req as Request, res as Response, next);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(User.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(generateToken).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
    });

    it('should return 409 if email already exists', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await register(req as Request, res as Response, next);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists.',
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });
  });
});
