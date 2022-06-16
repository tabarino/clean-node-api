import { AccountModel } from '@/domain/models';
import { AddAccount, AddAccountParams } from '@/domain/usecases';
import { AddAccountRepository, Hasher, LoadAccountbyEmailRepository } from '@/data/protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountbyEmailRepository: LoadAccountbyEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountbyEmailRepository.loadByEmail(accountData.email);

    if (account) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(accountData.password);

    return await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    });
  }
}
