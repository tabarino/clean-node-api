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
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;

      // const error = this.validation.validate(httpRequest.body);
      // if (error) {
      //   return badRequest(error);
      // }

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map(a => a.answer);
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
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
