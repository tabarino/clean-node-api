import { mockSurveyModels, mockSurveyModel } from '@/tests/domain/mocks';
import { SurveyModel } from '@/domain/models';
import { LoadSurveys, LoadSurveyById, AddSurvey, AddSurveyParams } from '@/domain/usecases';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams;

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    return Promise.resolve();
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

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel();
  id: string;

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id;
    return Promise.resolve(this.surveyModel);
  }
}
