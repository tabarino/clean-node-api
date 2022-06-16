import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import { DbLoadSurveyById } from '@/data/usecases';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);
  return { sut, loadSurveyByIdRepositorySpy };
};

let surveyId: string;

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadById(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(mockThrowError);
    const promise = sut.loadById(surveyId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return a Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const survey = await sut.loadById(surveyId);
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel);
  });
});
