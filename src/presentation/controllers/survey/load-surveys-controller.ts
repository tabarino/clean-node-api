import { LoadSurveys } from '@/domain/usecases';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { noContent, ok, serverError } from '@/presentation/helpers';

export namespace LoadSurveysController {
  export type Request = {
    accountId: string;
  }
}

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId);
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
