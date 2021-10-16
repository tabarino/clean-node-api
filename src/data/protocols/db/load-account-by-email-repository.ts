import { AccountModel } from '../../../domain/models/account';

export interface LoadAccountbyEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel>;
}
