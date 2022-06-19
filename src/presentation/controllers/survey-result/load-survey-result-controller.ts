import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
  }
}

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId } = request;
      const accountId = request.accountId;

      const hasSurvey = await this.checkSurveyById.checkById(surveyId);
      if (!hasSurvey) {
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
