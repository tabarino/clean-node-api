import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';
import { ValidationComposite } from './validation-composite';

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toEqual(new MissingParamError('any_field'));
  });

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toEqual(new Error());
  });

  test('Should not return if the validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
