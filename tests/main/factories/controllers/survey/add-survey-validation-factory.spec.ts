import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { makeAddSurveyValidation } from '@/main/factories';
import { Validation } from '@/presentation/protocols';

jest.mock('@/validation/validators/validation-composite');

describe('AddSurvey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();

    const validations: Validation[] = [];
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
