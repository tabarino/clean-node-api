import { AccountModel } from '@/domain/models';

export namespace LoadAccountByEmailRepository {
  export type Result = AccountModel;
}

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result>;
}
