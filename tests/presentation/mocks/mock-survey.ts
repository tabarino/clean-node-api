import { faker } from '@faker-js/faker';
import { SurveyModel } from '@/domain/models';
import { LoadSurveys, LoadAnswersBySurveyId, AddSurvey, CheckSurveyById } from '@/domain/usecases';
import { mockSurveyModels } from '@/tests/domain/mocks';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params;

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data;
    return Promise.resolve();
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  hasSurvey = true;
  id: string;

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id;
    return Promise.resolve(this.hasSurvey);
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels();
  accountId: string;
  callsCount = 0;

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    this.callsCount++;
    return Promise.resolve(this.surveyModels);
  }
}

export class LoadAnswersBySurveyIdSpy implements LoadAnswersBySurveyId {
  answers = [faker.random.word(), faker.random.word()];
  surveyId: string;

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyId.Result> {
    this.surveyId = surveyId;
    return Promise.resolve(this.answers);
  }
}
