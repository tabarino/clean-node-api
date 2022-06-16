import { makeDbLoadSurveyById, makeDbLoadSurveyResult, makeLogControllerDecorator } from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { LoadSurveyResultController } from '@/presentation/controllers';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult());
  return makeLogControllerDecorator(controller);
};
