import { faker } from '@faker-js/faker';
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
  result = { id: faker.datatype.uuid() };
  accessToken: string;
  role: string;

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.result)
  }
}
