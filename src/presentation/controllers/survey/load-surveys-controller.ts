import { LoadSurveys } from '@/domain/usecases';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { noContent, ok, serverError } from '@/presentation/helpers';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId);
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
