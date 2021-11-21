import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountbyEmailRepository } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountbyEmailRepository: LoadAccountbyEmailRepository
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountbyEmailRepository.loadByEmail(accountData.email);

    const hashedPassword = await this.hasher.hash(accountData.password);

    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    });

    return account;
  }
}
