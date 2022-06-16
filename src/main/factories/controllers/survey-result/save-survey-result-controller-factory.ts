import { makeDbLoadSurveyById, makeDbSaveSurveyResult, makeLogControllerDecorator } from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { makeSaveSurveyResultValidation } from './save-survey-result-validation-factory';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
