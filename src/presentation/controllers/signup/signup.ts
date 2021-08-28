import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount } from './signup-protocols';
import { badRequest, serverError, success } from '../../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../../errors';

export class SignUpController implements Controller {
  constructor (
    private readonly _emailValidator: EmailValidator,
    private readonly _addAccount: AddAccount
  ) { }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this._emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this._addAccount.add({
        name,
        email,
        password
      });

      return success(account);
    } catch (error) {
      return serverError();
    }
  }
}
