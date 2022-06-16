import { EmailValidatorAdapter } from '@/infra/validators'
import { makeLoginValidation } from '@/main/factories';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols';

jest.mock('@/validation/validators/validation-composite');

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
