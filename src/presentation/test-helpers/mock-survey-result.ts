import { SurveyResultModel } from '@/domain/models/survey-result';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { mockSurveyResultModel } from '@/domain/test-helpers';

// export const mockLoadSurveyResult = (): LoadSurveyResult => {
//   class LoadSurveyResultStub implements LoadSurveyResult {
//     async load (surveyId: string): Promise<SurveyResultModel> {
//       return Promise.resolve(mockSurveyResultModel());
//     }
//   }
//   return new LoadSurveyResultStub();
// };

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  surveyId: string;
  accountId: string

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.surveyResultModel);
  }
}

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }
  return new SaveSurveyResultStub();
};
