import { faker } from '@faker-js/faker';
import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyIdRepository
} from '@/data/protocols';
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  // Use the callsCount when the function has no parameters
  // In this case I left here only as example
  callsCount = 0;
  accountId: string;
  surveyModels = mockSurveyModels();

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    this.callsCount++;
    this.accountId = accountId;
    return Promise.resolve(this.surveyModels);
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  hasSurvey = true;
  id: string;

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id;
    return Promise.resolve(this.hasSurvey);
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel = mockSurveyModel();
  id: string;

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id;
    return Promise.resolve(this.surveyModel);
  }
}

export class LoadAnswersBySurveyIdRepositorySpy implements LoadAnswersBySurveyIdRepository {
  answers = [faker.random.word(), faker.random.word()];
  id: string;

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyIdRepository.Result> {
    this.id = id;
    return Promise.resolve(this.answers);
  }
}

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyData: AddSurveyRepository.Params;

  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
    this.surveyData = surveyData;
    return Promise.resolve();
  }
}
