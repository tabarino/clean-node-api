import { AddAccountRepository } from './db-add-account-protocols';
import { mockAccountModel, mockAddAccountParams, mockThrowError } from '@/domain/test-helpers';
import { HasherSpy, mockAccountRepository, LoadAccountByEmailRepositorySpy } from '@/data/test-helpers';
import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositoryStub: AddAccountRepository,
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositoryStub = mockAccountRepository();
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.fakeAccountModel = null;
  const sut = new DbAddAccount(hasherSpy, addAccountRepositoryStub, loadAccountByEmailRepositorySpy);
  return { sut, hasherSpy, addAccountRepositoryStub, loadAccountByEmailRepositorySpy };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.value).toBe(addAccountParams.password);
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(mockThrowError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, hasherSpy } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: hasherSpy.fakeHash
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
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.fakeAccountModel = mockAccountModel();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountbyEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });
});
