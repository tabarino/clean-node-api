import { HttpResponse } from '../protocols';
import { ServerError } from '../errors/server-error';

export const success = (): HttpResponse => ({
  statusCode: 200,
  body: ''
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});
