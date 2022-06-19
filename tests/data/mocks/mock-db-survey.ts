import { SurveyModel } from '@/domain/models';
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols';
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  // Use the callsCount when the function has no parameters
  // In this case I left here only as example
  callsCount = 0;
  accountId: string;
  surveyModels = mockSurveyModels();

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.callsCount++;
    this.accountId = accountId;
    return Promise.resolve(this.surveyModels);
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

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyData: AddSurveyRepository.Params;

  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
    this.surveyData = surveyData;
    return Promise.resolve();
  }
}
