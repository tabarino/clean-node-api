import { LoadAccountByToken } from '@/domain/usecases';
import { HttpResponse, Middleware } from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  }
}

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role);
        if (account) {
          return ok({ accountId: account.id });
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
