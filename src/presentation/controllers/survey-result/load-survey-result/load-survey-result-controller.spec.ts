import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { mockLoadSurveyById, LoadSurveyResultSpy } from '@/presentation/test-helpers';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import { mockSurveyResultModel, mockThrowError } from '@/domain/test-helpers';
import { HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols';
import { LoadSurveyResultController } from './load-survey-result-controller';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  accountId: faker.datatype.uuid()
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultSpy);
  return { sut, loadSurveyByIdStub, loadSurveyResultSpy };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSurveyResultSpy.surveyId).toBe(httpRequest.params.surveyId);
    expect(loadSurveyResultSpy.accountId).toBe(httpRequest.accountId);
  });

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
