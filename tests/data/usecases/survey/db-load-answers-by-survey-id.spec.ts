import { faker } from '@faker-js/faker';
import { DbLoadAnswersBySurveyId } from '@/data/usecases';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbLoadAnswersBySurveyId;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadAnswersBySurveyId(loadSurveyByIdRepositorySpy);
  return { sut, loadSurveyByIdRepositorySpy };
};

let surveyId: string;

describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(mockThrowError);
    const promise = sut.loadAnswers(surveyId);
    await expect(promise).rejects.toThrow();
  });
  test('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    loadSurveyByIdRepositorySpy.surveyModel = null;
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual([]);
  });

  test('Should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual(loadSurveyByIdRepositorySpy.surveyModel.answers.map(a => a.answer));
  });
});
