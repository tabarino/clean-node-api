import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';
import { LoadSurveyByIdRepository, LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) { }

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId);
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(data.surveyId);
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => ({
          ...answer,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }))
      }
    }

    return surveyResult;
  }
}
