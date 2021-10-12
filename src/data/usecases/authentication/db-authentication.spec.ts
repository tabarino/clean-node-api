import { AccountModel } from '../../../domain/models/account';
import { AuthenticationModel } from '../../../domain/usecases/authentication';
import { LoadAccountbyEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountbyEmailRepository => {
  class LoadAccountbyEmailRepositoryStub implements LoadAccountbyEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountbyEmailRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

interface SutTypes {
  sut: DbAuthentication;
  loadAccountbyEmailRepositoryStub: LoadAccountbyEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountbyEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountbyEmailRepositoryStub);
  return { sut, loadAccountbyEmailRepositoryStub };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountbyEmailRepository with correct email', async () => {
    const { sut, loadAccountbyEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountbyEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountbyEmailRepository throws', async () => {
    const { sut, loadAccountbyEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountbyEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
