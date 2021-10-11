import { AccountModel } from '../../../domain/models/account';
import { LoadAccountbyEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountbyEmailRepository with correct email', async () => {
    class LoadAccountbyEmailRepositoryStub implements LoadAccountbyEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }
        return await new Promise(resolve => resolve(account));
      }
    }
    const loadAccountbyEmailRepositoryStub = new LoadAccountbyEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountbyEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountbyEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    });
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
