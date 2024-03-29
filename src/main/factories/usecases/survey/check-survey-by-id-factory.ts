import { DbCheckSurveyById } from '@/data/usecases';
import { CheckSurveyById } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db/mongodb';

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyRepository = new SurveyMongoRepository();
  return new DbCheckSurveyById(surveyRepository);
};
