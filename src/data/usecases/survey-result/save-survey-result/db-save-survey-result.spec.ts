import MockDate from 'mockdate';
import { mockEmptySurveyResultModel, mockSaveSurveyResultParams, mockSurveyResultModel, mockThrowError } from '@/domain/test-helpers';
import { LoadSurveyResultRepositorySpy, mockLoadSurveyByIdRepository, mockSaveSurveyResultRepository } from '@/data/test-helpers';
import { LoadSurveyByIdRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols';
import { DbSaveSurveyResult } from './db-save-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbSaveSurveyResult(loadSurveyByIdRepositoryStub, loadSurveyResultRepositorySpy, saveSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositorySpy, saveSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
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
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyResultData.surveyId);
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(mockThrowError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId);
  });

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    const surveyResultData = mockSaveSurveyResultParams();
    const surveyResult = await sut.save(surveyResultData);
    expect(surveyResult).toEqual(mockEmptySurveyResultModel());
  });

  test('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());

    console.log(surveyResult);

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
