import {
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) { }

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId);
    return surveyResult;
  }
}
