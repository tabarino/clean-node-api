import { faker } from '@faker-js/faker';
import { mockAccountModel } from '@/tests/domain/mocks';
import { AccountModel, AuthenticationModel } from '@/domain/models';
import { AddAccount, AddAccountParams, LoadAccountByToken, Authentication, AuthenticationParams } from '@/domain/usecases';

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel();
  addAccountParams: AddAccountParams;

  async add (account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account;
    return Promise.resolve(this.accountModel);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  accountName = faker.name.findName();
  accessToken = faker.datatype.uuid();

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authentication;
    return Promise.resolve({
      name: this.accountName,
      accessToken: this.accessToken
    });
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel();
  accessToken: string;
  role: string;

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}
