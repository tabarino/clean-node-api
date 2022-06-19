import { AuthMiddleware } from '../middlewares';
import { HttpResponse } from './http';

export interface Middleware {
  handle (request: AuthMiddleware.Request): Promise<HttpResponse>;
}
