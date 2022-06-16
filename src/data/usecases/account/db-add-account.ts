import { AddAccount } from '@/domain/usecases';
import { AddAccountRepository, Hasher, LoadAccountbyEmailRepository } from '@/data/protocols';
import { AccountModel } from '@/domain/models';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountbyEmailRepository: LoadAccountbyEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<boolean> {
    let newAccount: AccountModel = null;
    const account = await this.loadAccountbyEmailRepository.loadByEmail(accountData.email);

    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      newAccount = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword
      });
    }

    return newAccount !== null;
  }
}
