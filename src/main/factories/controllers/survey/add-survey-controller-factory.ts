import { makeDbAddSurvey, makeLogControllerDecorator } from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { AddSurveyController } from '@/presentation/controllers';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey());
  return makeLogControllerDecorator(controller);
};
