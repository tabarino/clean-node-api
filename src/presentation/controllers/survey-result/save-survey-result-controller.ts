import { LoadAnswersBySurveyId, SaveSurveyResult } from '@/domain/usecases';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import { ok, forbidden, serverError, badRequest } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
    answer: string;
  }
}

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAnswersBySurveyId: LoadAnswersBySurveyId,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request;

      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const answers = await this.loadAnswersBySurveyId.loadAnswers(surveyId);

      if (answers.length === 0) {
        return forbidden(new InvalidParamError('surveyId'));
      }

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
