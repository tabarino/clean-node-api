import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { makeSaveSurveyResultValidation } from '@/main/factories';
import { Validation } from '@/presentation/protocols';

jest.mock('@/validation/validators/validation-composite');

describe('SaveSurveyResult Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation();
    const validations: Validation[] = [new RequiredFieldValidation('answer')];
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
