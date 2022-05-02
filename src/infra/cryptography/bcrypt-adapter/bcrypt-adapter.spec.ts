import bcrypt from 'bcrypt';
import { mockThrowError } from '@/domain/test-helpers';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value');
  },
  async compare (): Promise<boolean> {
    return await Promise.resolve(true);
  }
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  describe('Hash', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('Should return a valid hash on success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');
      expect(hash).toBe('hashed_value');
    });

    test('Should throw if hash throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(mockThrowError);
      const promise = sut.hash('any_value');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('Compare', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'hashed_value');
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'hashed_value');
    });

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'hashed_value');
      expect(isValid).toBe(true);
    });

    test('Should return false when compare fails', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { return false });
      const isValid = await sut.compare('any_value', 'hashed_value');
      expect(isValid).toBe(false);
    });

    test('Should throw if compare throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(mockThrowError);
      const promise = sut.compare('any_value', 'hashed_value');
      await expect(promise).rejects.toThrow();
    });
  });
});
