import { AccountModel, AddAccountRepository, Hasher, LoadAccountbyEmailRepository } from './db-add-account-protocols';
import { mockAccountModel, mockAddAccountParams, mockThrowError } from '@/domain/test-helpers';
import { mockAccountRepository, mockHasher } from '@/data/test-helpers';
import { DbAddAccount } from './db-add-account';

const mockLoadAccountByEmailRepository = (): LoadAccountbyEmailRepository => {
  class LoadAccountbyEmailRepositoryStub implements LoadAccountbyEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null));
    }
  }
  return new LoadAccountbyEmailRepositoryStub();
};

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository,
  loadAccountbyEmailRepositoryStub: LoadAccountbyEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAccountRepository();
  const loadAccountbyEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountbyEmailRepositoryStub);
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountbyEmailRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(mockAddAccountParams());
    expect(hashSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(mockThrowError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(mockThrowError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test('Should return null if LoadAccountbyEmailRepository does not return null', async () => {
    const { sut, loadAccountbyEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountbyEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()));
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountbyEmailRepository with correct email', async () => {
    const { sut, loadAccountbyEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountbyEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
