import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases';
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols';
import { ok, forbidden, serverError, badRequest } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;

      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map(a => a.answer);
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      });

      return ok(surveyResult);
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
