import { AccountModel } from '@/domain/models';

export namespace LoadAccountByTokenRepository {
  export type Result = AccountModel;
}

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result>;
}
