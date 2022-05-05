import { badRequest, serverError, unauthorised, ok } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols';

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;
      const authenticationModel = await this.authentication.auth({ email, password });
      if (!authenticationModel) {
        return unauthorised();
      }

      return ok(authenticationModel);
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
