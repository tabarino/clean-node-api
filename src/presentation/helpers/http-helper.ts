import { HttpResponse } from '@/presentation/protocols';
import { ServerError, UnauthorisedError } from '@/presentation/errors';

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const unauthorised = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorisedError()
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
});
