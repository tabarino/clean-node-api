import { faker } from '@faker-js/faker';
import { HttpRequest } from '@/presentation/protocols';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError, unauthorised } from '@/presentation/helpers';
import { LoginController } from '@/presentation/controllers';
import { mockAuthenticationParams, mockThrowError } from '@/tests/domain/mocks';
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks';

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams()
});

type SutTypes = {
  sut: LoginController;
  authenticationSpy: AuthenticationSpy;
  validationSpy: ValidationSpy;
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return { sut, authenticationSpy, validationSpy };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockReturnValue(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorised());
  });

  test('Should return 500 if Authetication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ name: authenticationSpy.accountName, accessToken: authenticationSpy.accessToken }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.body);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
});
