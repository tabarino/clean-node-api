import { faker } from '@faker-js/faker';
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors';
import { badRequest, ok, serverError, forbidden } from '@/presentation/helpers';
import { SignUpController } from '@/presentation/controllers';
import { mockThrowError } from '@/tests/domain/mocks';
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks';

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  };
};

type SutTypes = {
  sut: SignUpController,
  addAccountSpy: AddAccountSpy,
  validationSpy: ValidationSpy,
  authenticationSpy: AuthenticationSpy;
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy);
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  };
};

describe('SignUp Controller', () => {
  test('Should call AddAcount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    });
  });

  test('Should return 500 if AddAccount throws an error', async () => {
    const { sut, addAccountSpy } = makeSut();
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.isValid = false;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ name: authenticationSpy.accountName, accessToken: authenticationSpy.accessToken }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const request = mockRequest()
    await sut.handle(request);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    });
  });

  test('Should return 500 if Authetication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
