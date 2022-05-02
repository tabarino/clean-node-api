import MockDate from 'mockdate';
import { mockSurveyModel, mockThrowError } from '@/domain/test-helpers';
import { mockLoadSurveyByIdRepository } from '@/data/test-helpers';
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols';
import { DbLoadSurveyById } from './db-load-survey-by-id';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(mockThrowError);
    const promise = sut.loadById('any_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return a Survey on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById('any_id');
    expect(survey).toEqual(mockSurveyModel());
  });
});
