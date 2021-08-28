import { Controller, HttpRequest, HttpResponse, EmailValidator } from '../protocols';
import { badRequest, serverError, success } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../errors';

export class SignUpController implements Controller {
  constructor (private readonly _emailValidator: EmailValidator) { }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this._emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return success();
    } catch (error) {
      return serverError();
    }
  }
}
