import faker from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from '@/validation/validators';

const field = faker.random.word();
const fieldToCompare = faker.random.word();

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare);
};

describe('Compare Fields Validation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ [field]: faker.random.word(), [fieldToCompare]: faker.random.word() });
    expect(error).toEqual(new InvalidParamError(fieldToCompare));
  });

  it('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ [field]: 'any_value', [fieldToCompare]: 'any_value' });
    expect(error).toBeFalsy();
  });
});
