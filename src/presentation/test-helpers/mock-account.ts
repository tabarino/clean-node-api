import { AccountModel } from '@/domain/models/account';
import { AuthenticationModel } from '@/domain/models/authentication';
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account';
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { mockAccountModel } from '@/domain/test-helpers';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByTokenStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return await Promise.resolve({ name: 'any_name', accessToken: 'any_token' });
    }
  }
  return new AuthenticationStub();
};
