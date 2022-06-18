import { Authentication } from '@/domain/usecases';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import { badRequest, serverError, unauthorised, ok } from '@/presentation/helpers';

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  }
}

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;
      const authenticationResult = await this.authentication.auth({ email, password });
      if (!authenticationResult) {
        return unauthorised();
      }

      return ok(authenticationResult);
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
