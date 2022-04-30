import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'any_field_compare');
};

describe('Compare Fields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ any_field: 'any_value', any_field_compare: 'different_value' });
    expect(error).toEqual(new InvalidParamError('any_field_compare'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ any_field: 'any_value', any_field_compare: 'any_value' });
    expect(error).toBeFalsy();
  });
});
