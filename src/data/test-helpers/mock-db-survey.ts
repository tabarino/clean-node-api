import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test-helpers/mock-survey';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';

// export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
//   class LoadSurveysRepositoryStub implements LoadSurveysRepository {
//     async loadAll (accountId: string): Promise<SurveyModel[]> {
//       return await Promise.resolve(mockSurveyModels());
//     }
//   }
//   return new LoadSurveysRepositoryStub();
// };

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

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
};
