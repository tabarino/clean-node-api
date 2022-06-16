import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const accountId = httpRequest.accountId;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId);

      return ok(surveyResult);
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
