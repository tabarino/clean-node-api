import { faker } from '@faker-js/faker';
import { mockAccountModel } from '@/tests/domain/mocks';
import { AccountModel } from '@/domain/models';
import { AddAccount, LoadAccountByToken, Authentication } from '@/domain/usecases';

export class AddAccountSpy implements AddAccount {
  isValid = true;
  addAccountParams: AddAccount.Params;

  async add (account: AddAccount.Params): Promise<boolean> {
    this.addAccountParams = account;
    return Promise.resolve(this.isValid);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  accountName = faker.name.findName();
  accessToken = faker.datatype.uuid();

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
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
