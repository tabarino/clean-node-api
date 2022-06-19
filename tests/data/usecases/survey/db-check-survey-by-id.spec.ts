import { faker } from '@faker-js/faker';
import { DbCheckSurveyById } from '@/data/usecases';
import { mockThrowError } from '@/tests/domain/mocks';
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbCheckSurveyById;
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy;
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy();
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy);
  return { sut, checkSurveyByIdRepositorySpy };
};

let surveyId: string;

describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  })

  test('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(mockThrowError);
    const promise = sut.checkById(surveyId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    checkSurveyByIdRepositorySpy.hasSurvey = false;
    const hasSurvey = await sut.checkById(surveyId);
    expect(hasSurvey).toBe(false);
  });

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut();
    const hasSurvey = await sut.checkById(surveyId);
    expect(hasSurvey).toBe(true);
  });
});
