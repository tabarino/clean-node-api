import MockDate from 'mockdate';
import { DbAddSurvey } from '@/data/usecases';
import { mockAddSurveyParams, mockThrowError } from '@/tests/domain/mocks';
import { AddSurveyRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositorySpy: AddSurveyRepositorySpy;
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);
  return { sut, addSurveyRepositorySpy };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);
    expect(addSurveyRepositorySpy.surveyData).toEqual(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(mockThrowError);
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
