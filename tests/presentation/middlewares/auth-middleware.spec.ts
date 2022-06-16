import faker from '@faker-js/faker';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { HttpRequest } from '@/presentation/protocols';
import { AuthMiddleware } from '@/presentation/middlewares';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks';

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.random.alpha(32)
  }
});

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenSpy: LoadAccountByTokenSpy;
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy();
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role);
  return { sut, loadAccountByTokenSpy };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = faker.random.word();
    const { sut, loadAccountByTokenSpy } = makeSut(role);
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token']);
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.accountModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accountId: loadAccountByTokenSpy.accountModel.id }));
  });
});
