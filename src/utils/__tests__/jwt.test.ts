// src/utils/__tests__/jwt.test.ts

import { generateToken, verifyToken } from '../jwt';
import jsonwebtoken from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Utility', () => {
  const payload = { id: 1, email: 'john@example.com' };
  const secret = 'your_jwt_secret';
  const token = 'fake-jwt-token';

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
  });

  // Test generateToken
  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      (jsonwebtoken.sign as jest.Mock).mockReturnValue(token);

      const generatedToken = generateToken(payload);

      expect(jsonwebtoken.sign).toHaveBeenCalledWith(payload, secret, {
        expiresIn: '1h',
      });
      expect(generatedToken).toBe(token);
    });
  });

  // Test verifyToken
  describe('verifyToken', () => {
    it('should verify and return the payload if token is valid', () => {
      (jsonwebtoken.verify as jest.Mock).mockReturnValue(payload);

      const decoded = verifyToken(token);

      expect(jsonwebtoken.verify).toHaveBeenCalledWith(token, secret);
      expect(decoded).toEqual(payload);
    });

    it('should return null if token is invalid', () => {
      (jsonwebtoken.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const decoded = verifyToken('invalid-token');

      expect(jsonwebtoken.verify).toHaveBeenCalledWith('invalid-token', secret);
      expect(decoded).toBeNull();
    });
  });
});
