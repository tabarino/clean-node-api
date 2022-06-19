import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { ok, forbidden, serverError, badRequest } from '@/presentation/helpers';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadAnswersBySurveyIdSpy, SaveSurveyResultSpy, ValidationSpy } from '@/tests/presentation/mocks';

const mockRequest = (answer: string = null): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer
});

type SutTypes = {
  sut: SaveSurveyResultController;
  validationSpy: ValidationSpy;
  loadAnswersBySurveyIdSpy: LoadAnswersBySurveyIdSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const loadAnswersBySurveyIdSpy = new LoadAnswersBySurveyIdSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(validationSpy, loadAnswersBySurveyIdSpy, saveSurveyResultSpy);
  return { sut, validationSpy, loadAnswersBySurveyIdSpy, saveSurveyResultSpy };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  test('Should call LoadAnswersBySurveyId with correct values', async () => {
    const { sut, loadAnswersBySurveyIdSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(loadAnswersBySurveyIdSpy.surveyId).toEqual(request.surveyId);
  });

  test('Should return 403 if LoadAnswersBySurveyId returns null', async () => {
    const { sut, loadAnswersBySurveyIdSpy } = makeSut();
    loadAnswersBySurveyIdSpy.answers = [];
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should return 500 if LoadAnswersBySurveyId throws', async () => {
    const { sut, loadAnswersBySurveyIdSpy } = makeSut();
    jest.spyOn(loadAnswersBySurveyIdSpy, 'loadAnswers').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, loadAnswersBySurveyIdSpy, saveSurveyResultSpy } = makeSut();
    const request = mockRequest(loadAnswersBySurveyIdSpy.answers[0]);
    await sut.handle(request);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, loadAnswersBySurveyIdSpy, saveSurveyResultSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(mockThrowError);
    const request = mockRequest(loadAnswersBySurveyIdSpy.answers[0]);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, loadAnswersBySurveyIdSpy, saveSurveyResultSpy } = makeSut();
    const request = mockRequest(loadAnswersBySurveyIdSpy.answers[0]);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
