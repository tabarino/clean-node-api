import { AddSurvey } from '@/domain/usecases';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import { badRequest, noContent, serverError } from '@/presentation/helpers';

export namespace AddSurveyController {
  export type Request = {
    question: string;
    answers: Answer[];
  }

  type Answer = {
    image?: string;
    answer: string;
  }
}

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request;
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      });

      return noContent();
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
    }
  }
}
