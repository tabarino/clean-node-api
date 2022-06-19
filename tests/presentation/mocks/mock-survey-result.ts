import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  surveyId: string;
  accountId: string

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.surveyResultModel);
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  saveSurveyResultParams: SaveSurveyResult.Params;

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data;
    return Promise.resolve(this.surveyResultModel);
  }
}
