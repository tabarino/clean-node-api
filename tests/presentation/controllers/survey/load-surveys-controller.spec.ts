import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { noContent, ok, serverError } from '@/presentation/helpers';
import { LoadSurveysController } from '@/presentation/controllers';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadSurveysSpy } from '@/tests/presentation/mocks';

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: faker.datatype.uuid()
});

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysSpy: LoadSurveysSpy;
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy();
  const sut = new LoadSurveysController(loadSurveysSpy);
  return { sut, loadSurveysSpy };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(loadSurveysSpy.accountId).toEqual(request.accountId);
  });

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.surveyModels = [];
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels));
  });
});
