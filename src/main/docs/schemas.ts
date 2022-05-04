import {
  accountSchema,
  addSurveyParamsSchema,
  errorSchema,
  loginParamsSchema,
  saveSurveyResultParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  surveyResultSchema
} from './schemas/';
import { surveyResultAnswerSchema } from './schemas/survey-result-answer-schema';

export default {
  error: errorSchema,
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  surveyAnswer: surveyAnswerSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
};
