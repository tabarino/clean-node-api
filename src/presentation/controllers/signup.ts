import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { EmailValidator } from '../protocols/email-validator';
import { badRequest, serverError, success } from '../helpers/http-helper';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';

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
