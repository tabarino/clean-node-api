import { HttpResponse } from '../protocols';
import { ServerError } from '../errors/server-error';
import { AccountModel } from '../../domain/models/account';

export const success = (account: AccountModel): HttpResponse => ({
  statusCode: 200,
  body: account
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});
