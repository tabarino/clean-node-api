import { DbLoadAnswersBySurveyId } from '@/data/usecases';
import { LoadAnswersBySurveyId } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db/mongodb';

export const makeDbLoadAnswersBySurveyId = (): LoadAnswersBySurveyId => {
  const surveyRepository = new SurveyMongoRepository();
  return new DbLoadAnswersBySurveyId(surveyRepository);
};
