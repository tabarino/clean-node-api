import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultParams } from '@/domain/usecases';
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel = mockSurveyResultModel();
  surveyId: string;
  accountId: string;

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.surveyResultModel);
  }
}

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  data: SaveSurveyResultParams;

  async save (data: SaveSurveyResultParams): Promise<void> {
    this.data = data;
    return Promise.resolve();
  }
}
