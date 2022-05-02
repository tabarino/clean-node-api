import { SaveSurveyResult, Controller, HttpRequest, HttpResponse, Validation, LoadSurveyById } from './save-survey-result-controller-protocols';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // const error = this.validation.validate(httpRequest.body);
      // if (error) {
      //   return badRequest(error);
      // }

      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      // const { surveyId, accountId, answer } = httpRequest.body;
      // await this.saveSurveyResult.save({
      //   surveyId,
      //   accountId,
      //   answer,
      //   date: new Date()
      // });

      // return noContent();
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
