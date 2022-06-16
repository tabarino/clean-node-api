import { EmailValidatorAdapter } from '@/infra/validators'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { makeSignUpValidation } from '@/main/factories';
import { Validation } from '@/presentation/protocols';

jest.mock('@/validation/validators/validation-composite');

describe('Signup Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
