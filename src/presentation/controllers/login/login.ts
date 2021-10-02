import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorised, ok } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols';

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredField = ['email', 'password'];
      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorised();
      }

      return ok({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
