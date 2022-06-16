import { faker } from '@faker-js/faker';
import { LogControllerDecorator } from '@/main/decorators';
import { ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { SignUpController } from '@/presentation/controllers';
import { mockAccountModel } from '@/tests/domain/mocks';
import { LogErrorRepositorySpy } from '@/tests/data/mocks';

class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel())
  request: any

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return Promise.resolve(this.httpResponse)
  }
}

type SutTypes = {
  sut: LogControllerDecorator,
  controllerSpy: ControllerSpy,
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy();
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);
  return { sut, controllerSpy, logErrorRepositorySpy };
}

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  };
};

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(controllerSpy.request).toEqual(request);
  });

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
    const serverError = mockServerError();
    controllerSpy.httpResponse = serverError;
    await sut.handle(mockRequest());
    expect(logErrorRepositorySpy.stack).toEqual(serverError.body.stack);
  });
});
