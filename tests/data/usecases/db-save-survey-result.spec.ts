import MockDate from 'mockdate';
import { DbSaveSurveyResult } from '@/data/usecases';
import { mockSaveSurveyResultParams, mockThrowError } from '@/tests/domain/mocks';
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbSaveSurveyResult;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const sut = new DbSaveSurveyResult(loadSurveyByIdRepositorySpy, loadSurveyResultRepositorySpy, saveSurveyResultRepositorySpy);
  return { sut, loadSurveyResultRepositorySpy, saveSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSurveyResultRepositorySpy.data).toEqual(surveyResultData);
  });

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(mockThrowError);
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
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyResultData.surveyId);
  });

  test('Should return surveyResultModel with all answers with count 0 if SaveSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const surveyResultData = mockSaveSurveyResultParams();
    const surveyResult = await sut.save(surveyResultData);
    const { surveyModel } = loadSurveyByIdRepositorySpy;
    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    });
  });

  test('Should return a SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel);
  });
});
