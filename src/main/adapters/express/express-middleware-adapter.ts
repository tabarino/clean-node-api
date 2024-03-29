import { Response, RequestHandler, NextFunction } from 'express';
import { Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: any, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    }
    const httpResponse = await middleware.handle(request);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
        stack: httpResponse.body.stack
      });
    }
  }
};
