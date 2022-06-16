import faker from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidation } from '@/validation/validators';
import { mockThrowError } from '@/tests/domain/mocks';
import { EmailValidatorSpy } from '@/tests/validation/mocks';

const field = faker.random.word();

type SutTypes = {
  sut: EmailValidation,
  emailValidatorSpy: EmailValidatorSpy,
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation(emailValidatorSpy, field);
  return { sut, emailValidatorSpy };
};

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const error = sut.validate({ [field]: faker.internet.email() });
    expect(error).toEqual(new InvalidParamError(field));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut();
    const email = faker.internet.email();
    sut.validate({ [field]: email });
    expect(emailValidatorSpy.email).toBe(email);
  });

  test('Should throw if EmailValidator throws an error', () => {
    const { sut, emailValidatorSpy } = makeSut();
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(mockThrowError);
    expect(sut.validate).toThrow();
  });
});
