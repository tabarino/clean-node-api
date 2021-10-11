import { AccountModel } from '../../domain/models/account';

export interface LoadAccountbyEmailRepository {
  load: (email: string) => Promise<AccountModel>;
}
