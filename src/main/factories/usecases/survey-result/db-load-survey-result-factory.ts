import { DbLoadSurveyResult } from '@/data/usecases';
import { LoadSurveyResult } from '@/domain/usecases';
import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infra/db/mongodb';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyRepository = new SurveyMongoRepository();
  const surveyResultRepository = new SurveyResultMongoRepository();
  return new DbLoadSurveyResult(surveyResultRepository, surveyRepository)
};
