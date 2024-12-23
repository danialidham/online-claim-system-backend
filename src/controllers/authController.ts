import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import PasswordReset from '../models/PasswordReset';
import { generateToken } from '../utils/jwt';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(409).json({ message: 'Email already exists.' });
    return;
  }

  const user = await User.create({ name, email, password });

  const token = generateToken({ id: user.id, email: user.email });

  res.status(201).json({ token });
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const isValid = await user.validPassword(password);
  if (!isValid) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = generateToken({ id: user.id, email: user.email });

  res.status(200).json({ token });
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordBody>,
  res: Response,
  next: NextFunction
) => {
  const { token, newPassword } = req.body;

  const passwordReset = await PasswordReset.findOne({ where: { token } });
  if (!passwordReset || passwordReset.expiresAt < new Date()) {
    res
      .status(400)
      .json({ message: 'Invalid or expired password reset token.' });
    return;
  }

  const user = await User.findByPk(passwordReset.userId);
  if (!user) {
    res.status(400).json({ message: 'Invalid password reset token.' });
    return;
  }

  user.password = newPassword;
  await user.save();

  await passwordReset.destroy();

  res.status(200).json({ message: 'Password has been reset successfully.' });
};
