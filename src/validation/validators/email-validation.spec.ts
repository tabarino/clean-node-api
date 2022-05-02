import { EmailValidator } from '@/validation/protocols/email-validator';
import { InvalidParamError } from '@/presentation/errors';
import { mockThrowError } from '@/domain/test-helpers';
import { EmailValidation } from './email-validation';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

type SutTypes = {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator,
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation(emailValidatorStub, 'email');
  return { sut, emailValidatorStub };
};

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'any_email@test.com' });
    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any_email@test.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@test.com');
  });

  test('Should throw if EmailValidator throws an error', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(mockThrowError);
    expect(sut.validate).toThrow();
  });
});
