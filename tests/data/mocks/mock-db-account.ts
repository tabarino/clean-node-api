import { AddAccountRepository, LoadAccountbyEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols';
import { mockAccountModel } from '@/tests/domain/mocks';

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true;
  accountData: AddAccountRepository.Params;

  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.accountData = accountData;
    return Promise.resolve(this.result);
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountbyEmailRepository {
  accountModel = mockAccountModel();
  email: string;

  async loadByEmail (email: string): Promise<LoadAccountbyEmailRepository.Result> {
    this.email = email;
    return Promise.resolve(this.accountModel);
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  accountModel = mockAccountModel();
  token: string;
  role: string;

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return Promise.resolve(this.accountModel);
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string;
  token: string;

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
    return Promise.resolve();
  }
}
