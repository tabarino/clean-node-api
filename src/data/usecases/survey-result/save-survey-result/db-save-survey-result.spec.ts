import MockDate from 'mockdate';
import { mockSaveSurveyResultParams, mockSurveyResultModel, mockThrowError } from '@/domain/test-helpers';
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test-helpers';
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols';
import { DbSaveSurveyResult } from './db-save-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(loadSurveyResultRepositoryStub, saveSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub, saveSurveyResultRepositoryStub };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(mockThrowError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId);
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(mockThrowError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
