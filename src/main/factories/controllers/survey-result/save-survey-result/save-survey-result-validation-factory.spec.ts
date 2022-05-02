import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeSaveSurveyResultValidation } from './save-survey-result-validation-factory';

jest.mock('@/validation/validators/validation-composite');

describe('SaveSurveyResult Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation();
    const validations: Validation[] = [new RequiredFieldValidation('answer')];
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
