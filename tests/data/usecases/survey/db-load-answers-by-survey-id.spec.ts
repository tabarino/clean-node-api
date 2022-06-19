import { faker } from '@faker-js/faker';
import { DbLoadAnswersBySurveyId } from '@/data/usecases';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadAnswersBySurveyIdRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbLoadAnswersBySurveyId;
  loadAnswersBySurveyIdRepositorySpy: LoadAnswersBySurveyIdRepositorySpy;
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyIdRepositorySpy = new LoadAnswersBySurveyIdRepositorySpy();
  const sut = new DbLoadAnswersBySurveyId(loadAnswersBySurveyIdRepositorySpy);
  return { sut, loadAnswersBySurveyIdRepositorySpy };
};

let surveyId: string;

describe('DbLoadAnswersBySurveyId', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  })

  test('Should call LoadAnswersBySurveyIdRepository', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyIdRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadAnswersBySurveyIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut();
    jest.spyOn(loadAnswersBySurveyIdRepositorySpy, 'loadAnswers').mockImplementationOnce(mockThrowError);
    const promise = sut.loadAnswers(surveyId);
    await expect(promise).rejects.toThrow();
  });
  test('Should return empty array if LoadAnswersBySurveyIdRepository returns []', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut();
    loadAnswersBySurveyIdRepositorySpy.answers = [];
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual([]);
  });

  test('Should return answers on success', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut();
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual(loadAnswersBySurveyIdRepositorySpy.answers);
  });
});
