import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { mockEmptySurveyResultModel, mockThrowError } from '@/domain/test-helpers';
import { mockLoadSurveyByIdRepository, LoadSurveyResultRepositorySpy } from '@/data/test-helpers';
import { LoadSurveyByIdRepository } from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub };
};

let surveyId: string;
let accountId: string;

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    surveyId = faker.datatype.uuid();
    accountId = faker.datatype.uuid();
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    await sut.load(surveyId, accountId);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId);
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.load(surveyId, accountId);
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId);
  });

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toEqual(mockEmptySurveyResultModel());
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(mockThrowError);
    const promise = sut.load(surveyId, accountId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel);
  });
});
