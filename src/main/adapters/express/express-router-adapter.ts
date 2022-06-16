import { Request, Response, RequestHandler } from 'express';
import { Controller } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.params || {}),
      ...(req.body || {}),
      accountId: req.accountId
    };
    const httpResponse = await controller.handle(request);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      });
    }
  };
};
