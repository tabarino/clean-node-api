import { AccountModel } from '@/domain/models';

export namespace LoadAccountbyEmailRepository {
  export type Result = AccountModel;
}

export interface LoadAccountbyEmailRepository {
  loadByEmail (email: string): Promise<LoadAccountbyEmailRepository.Result>;
}
