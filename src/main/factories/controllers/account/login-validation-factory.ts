import { EmailValidatorAdapter } from '@/infra/validators';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
  return new ValidationComposite(validations);
};
