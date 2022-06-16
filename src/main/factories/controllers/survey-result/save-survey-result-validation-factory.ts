import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols';

export const makeSaveSurveyResultValidation = (): ValidationComposite => {
  const validations: Validation[] = [new RequiredFieldValidation('answer')];
  return new ValidationComposite(validations);
};
