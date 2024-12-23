import { Request, Response, NextFunction } from 'express';
import errorHandler from '../errorHandler';

describe('Error Handler Middleware', () => {
  let err: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    err = new Error('Test error');
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should log the error and send 500 response', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(err, req as Request, res as Response, next);

    expect(consoleSpy).toHaveBeenCalledWith(err.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error.',
    });

    consoleSpy.mockRestore();
  });

  it('should handle non-error inputs gracefully', () => {
    err = 'Non-error string';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(err, req as Request, res as Response, next);

    expect(consoleSpy).toHaveBeenCalledWith('Non-error string');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error.',
    });

    consoleSpy.mockRestore();
  });
});
