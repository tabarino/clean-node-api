import { MissingParamError } from '../../errors';
import { Validation } from './validation';
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
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);
  return { sut, validationStub };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toEqual(new MissingParamError('any_field'));
  });
});
