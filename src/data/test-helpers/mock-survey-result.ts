import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/domain/test-helpers/mock-survey-result';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';

// export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
//   class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
//     async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
//       return Promise.resolve(mockSurveyResultModel());
//     }
//   }
//   return new LoadSurveyResultRepositoryStub();
// };

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

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
