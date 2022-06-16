import { AddAccount } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';

export namespace AddAccountRepository {
  export type Params = AddAccount.Params;
  export type Result = AccountModel;
}

export interface AddAccountRepository {
  add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result>;
}
