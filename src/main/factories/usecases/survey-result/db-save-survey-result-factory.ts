import { DbSaveSurveyResult } from '@/data/usecases';
import { SaveSurveyResult } from '@/domain/usecases';
import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infra/db/mongodb';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyRepository = new SurveyMongoRepository();
  const surveyResultRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyRepository, surveyResultRepository, surveyResultRepository);
};
