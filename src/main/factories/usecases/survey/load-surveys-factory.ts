import { DbLoadSurveys } from '@/data/usecases';
import { LoadSurveys } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db/mongodb';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyRepository);
};
