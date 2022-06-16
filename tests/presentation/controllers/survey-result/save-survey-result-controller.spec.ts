import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { ok, forbidden, serverError, badRequest } from '@/presentation/helpers';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { HttpRequest } from '@/presentation/protocols';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { mockThrowError } from '@/tests/domain/mocks';
import { LoadSurveyByIdSpy, SaveSurveyResultSpy, ValidationSpy } from '@/tests/presentation/mocks';

const mockRequest = (answer: string = null): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  },
  body: {
    answer
  },
  accountId: faker.datatype.uuid()
});

type SutTypes = {
  sut: SaveSurveyResultController;
  validationSpy: ValidationSpy;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(validationSpy, loadSurveyByIdSpy, saveSurveyResultSpy);
  return { sut, validationSpy, loadSurveyByIdSpy, saveSurveyResultSpy };
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
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.body);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSurveyByIdSpy.id).toEqual(httpRequest.params.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut();
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer);
    await sut.handle(httpRequest);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date()
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(mockThrowError);
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut();
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
