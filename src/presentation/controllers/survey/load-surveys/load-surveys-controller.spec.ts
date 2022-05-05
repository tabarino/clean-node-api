import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { mockSurveyModels, mockThrowError } from '@/domain/test-helpers';
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { mockLoadSurveys } from '@/presentation/test-helpers';
import { HttpRequest, LoadSurveys } from './load-surveys-controller-protocols';
import { LoadSurveysController } from './load-surveys-controller';

const mockRequest = (): HttpRequest => ({
  accountId: faker.datatype.uuid()
});

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return { sut, loadSurveysStub };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.accountId);
  });

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });
});
