import { HttpResponse } from '../../protocols';
import { ServerError, UnauthorisedError } from '../../errors';

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const unauthorised = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorisedError()
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
});
