import { AddAccount } from '@/domain/usecases';
import { AddAccountRepository, Hasher, CheckAccountByEmailRepository } from '@/data/protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<boolean> {
    let isValid = false;
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email);
    if (!hasAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      isValid = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword
      });
    }
    return isValid;
  }
}
