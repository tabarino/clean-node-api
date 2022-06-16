import { AccountModel } from '@/domain/models';
import { LoadAccountByToken } from '@/domain/usecases';
import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    let decryptedToken: string;

    try {
      decryptedToken = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }

    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
      if (account) {
        return account;
      }
    }

    return null;
  }
}
