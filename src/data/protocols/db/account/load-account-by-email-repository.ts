import { AccountModel } from '@/domain/models';

export interface LoadAccountbyEmailRepository {
  loadByEmail (email: string): Promise<AccountModel>;
}
