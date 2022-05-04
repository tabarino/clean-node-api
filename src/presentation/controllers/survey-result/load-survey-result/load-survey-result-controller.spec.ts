import MockDate from 'mockdate';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test-helpers';
import { HttpRequest, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols';
import { LoadSurveyResultController } from './load-survey-result-controller';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub);
  return { sut, loadSurveyByIdStub, loadSurveyResultStub };
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

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
