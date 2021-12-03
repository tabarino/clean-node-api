import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols';
import { noContent, ok, serverError } from '../../../helpers/http/http-helper';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}