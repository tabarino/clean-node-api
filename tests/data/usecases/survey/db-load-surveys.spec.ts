import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import { DbLoadSurveys } from '@/data/usecases';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadSurveysRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
  return { sut, loadSurveysRepositorySpy };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const accountId = faker.datatype.uuid();
    await sut.load(accountId);
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
    expect(loadSurveysRepositorySpy.callsCount).toBe(1);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(mockThrowError);
    const promise = sut.load(faker.datatype.uuid());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load(faker.datatype.uuid());
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });
});
